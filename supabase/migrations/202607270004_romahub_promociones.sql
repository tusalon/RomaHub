-- RomaHub - Fase 6: promociones temporales y métricas por oferta.

create table if not exists public.promociones_romahub (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  titulo text not null check (char_length(trim(titulo)) between 3 and 120),
  descripcion text check (descripcion is null or char_length(descripcion) <= 600),
  tipo text not null default 'general' check (tipo in ('general', 'servicio', 'producto', 'curso')),
  item_id text,
  precio_anterior numeric(12,2) check (precio_anterior is null or precio_anterior >= 0),
  precio_promocional numeric(12,2) check (precio_promocional is null or precio_promocional >= 0),
  moneda text not null default 'CUP' check (moneda in ('CUP', 'USD', 'EUR', 'MXN')),
  imagen_url text check (imagen_url is null or char_length(imagen_url) <= 1200),
  fecha_inicio timestamptz not null default now(),
  fecha_fin timestamptz not null,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (fecha_fin > fecha_inicio),
  check (
    precio_anterior is null
    or precio_promocional is null
    or precio_promocional < precio_anterior
  )
);

create index if not exists promociones_romahub_publicas_idx
  on public.promociones_romahub (activo, fecha_fin, fecha_inicio);

create index if not exists promociones_romahub_negocio_idx
  on public.promociones_romahub (negocio_id, created_at desc);

create or replace function public.set_promociones_romahub_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists promociones_romahub_set_updated_at on public.promociones_romahub;
create trigger promociones_romahub_set_updated_at
before update on public.promociones_romahub
for each row execute function public.set_promociones_romahub_updated_at();

alter table public.promociones_romahub enable row level security;

grant select on table public.promociones_romahub to anon, authenticated;
grant insert, update, delete on table public.promociones_romahub to authenticated;

drop policy if exists "Promociones vigentes publicas" on public.promociones_romahub;
create policy "Promociones vigentes publicas"
on public.promociones_romahub
for select
to anon, authenticated
using (activo = true and fecha_inicio <= now() and fecha_fin > now());

drop policy if exists "Duenos ven sus promociones" on public.promociones_romahub;
create policy "Duenos ven sus promociones"
on public.promociones_romahub
for select
to authenticated
using (
  exists (
    select 1 from public.usuarios_negocio u
    where u.negocio_id = promociones_romahub.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
      and u.rol in ('dueno', 'admin')
  )
);

drop policy if exists "Duenos crean promociones" on public.promociones_romahub;
create policy "Duenos crean promociones"
on public.promociones_romahub
for insert
to authenticated
with check (
  exists (
    select 1 from public.usuarios_negocio u
    where u.negocio_id = promociones_romahub.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
      and u.rol in ('dueno', 'admin')
  )
);

drop policy if exists "Duenos actualizan promociones" on public.promociones_romahub;
create policy "Duenos actualizan promociones"
on public.promociones_romahub
for update
to authenticated
using (
  exists (
    select 1 from public.usuarios_negocio u
    where u.negocio_id = promociones_romahub.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
      and u.rol in ('dueno', 'admin')
  )
)
with check (
  exists (
    select 1 from public.usuarios_negocio u
    where u.negocio_id = promociones_romahub.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
      and u.rol in ('dueno', 'admin')
  )
);

drop policy if exists "Duenos eliminan promociones" on public.promociones_romahub;
create policy "Duenos eliminan promociones"
on public.promociones_romahub
for delete
to authenticated
using (
  exists (
    select 1 from public.usuarios_negocio u
    where u.negocio_id = promociones_romahub.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
      and u.rol in ('dueno', 'admin')
  )
);

alter table public.romahub_eventos
  drop constraint if exists romahub_eventos_evento_check;

alter table public.romahub_eventos
  add constraint romahub_eventos_evento_check check (evento in (
    'perfil_vista', 'producto_visto', 'whatsapp_click',
    'reserva_click', 'compartir', 'favorito',
    'promocion_vista', 'promocion_click'
  ));

alter table public.romahub_eventos
  drop constraint if exists romahub_eventos_item_tipo_check;

alter table public.romahub_eventos
  add constraint romahub_eventos_item_tipo_check check (
    item_tipo is null or item_tipo in ('producto', 'curso', 'servicio', 'promocion')
  );

create or replace function public.mis_metricas_promociones_romahub(
  p_negocio_id uuid,
  p_dias integer default 30
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_periodo integer := greatest(7, least(90, coalesce(p_dias, 30)));
  v_resultado jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'Inicia sesion para continuar.' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.usuarios_negocio u
    where u.user_id = auth.uid()
      and u.negocio_id = p_negocio_id
      and u.activo = true
      and u.rol in ('dueno', 'admin')
  ) then
    raise exception 'No tienes permiso para ver estas metricas.' using errcode = '42501';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', resumen.id,
        'vistas', resumen.vistas,
        'contactos', resumen.contactos
      ) order by resumen.created_at desc
    ),
    '[]'::jsonb
  )
  into v_resultado
  from (
    select
      p.id,
      p.created_at,
      count(e.id) filter (where e.evento = 'promocion_vista') as vistas,
      count(e.id) filter (where e.evento = 'promocion_click') as contactos
    from public.promociones_romahub p
    left join public.romahub_eventos e
      on e.negocio_id = p.negocio_id
      and e.item_tipo = 'promocion'
      and e.item_id = p.id::text
      and e.created_at >= now() - make_interval(days => v_periodo)
    where p.negocio_id = p_negocio_id
    group by p.id, p.created_at
  ) resumen;

  return v_resultado;
end;
$$;

revoke all on function public.mis_metricas_promociones_romahub(uuid, integer) from public;
grant execute on function public.mis_metricas_promociones_romahub(uuid, integer) to authenticated;

comment on table public.promociones_romahub is
  'Ofertas temporales publicadas por los negocios de RomaHub. Las promociones vencidas dejan de ser públicas automáticamente.';

notify pgrst, 'reload schema';
