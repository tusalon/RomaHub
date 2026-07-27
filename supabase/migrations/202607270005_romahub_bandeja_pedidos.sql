-- RomaHub - Fase 7: bandeja privada de pedidos para cada negocio.

alter table public.pedidos_whatsapp
  add column if not exists updated_at timestamptz not null default now();

alter table public.pedidos_whatsapp
  drop constraint if exists pedidos_whatsapp_estado_check;

alter table public.pedidos_whatsapp
  add constraint pedidos_whatsapp_estado_check check (
    estado in ('enviado_whatsapp', 'nuevo', 'contactado', 'completado', 'cancelado')
  ) not valid;

create index if not exists pedidos_whatsapp_negocio_estado_created_idx
  on public.pedidos_whatsapp (negocio_id, estado, created_at desc);

create or replace function public.set_pedidos_whatsapp_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pedidos_whatsapp_set_updated_at on public.pedidos_whatsapp;
create trigger pedidos_whatsapp_set_updated_at
before update on public.pedidos_whatsapp
for each row execute function public.set_pedidos_whatsapp_updated_at();

alter table public.pedidos_whatsapp enable row level security;

revoke select, update, delete on table public.pedidos_whatsapp from anon;
revoke insert, delete on table public.pedidos_whatsapp from authenticated;
grant insert on table public.pedidos_whatsapp to anon;
grant select on table public.pedidos_whatsapp to authenticated;
revoke update on table public.pedidos_whatsapp from authenticated;
grant update (estado) on table public.pedidos_whatsapp to authenticated;

drop policy if exists "Duenos ven pedidos de su negocio" on public.pedidos_whatsapp;
create policy "Duenos ven pedidos de su negocio"
on public.pedidos_whatsapp
for select
to authenticated
using (
  exists (
    select 1 from public.usuarios_negocio u
    where u.negocio_id = pedidos_whatsapp.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
      and u.rol in ('dueno', 'admin')
  )
);

drop policy if exists "Duenos actualizan estado de sus pedidos" on public.pedidos_whatsapp;
create policy "Duenos actualizan estado de sus pedidos"
on public.pedidos_whatsapp
for update
to authenticated
using (
  exists (
    select 1 from public.usuarios_negocio u
    where u.negocio_id = pedidos_whatsapp.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
      and u.rol in ('dueno', 'admin')
  )
)
with check (
  exists (
    select 1 from public.usuarios_negocio u
    where u.negocio_id = pedidos_whatsapp.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
      and u.rol in ('dueno', 'admin')
  )
);

create or replace function public.mis_resumen_pedidos_romahub(
  p_negocio_id uuid,
  p_dias integer default 90
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_periodo integer := greatest(7, least(365, coalesce(p_dias, 90)));
  v_resultado jsonb;
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
    raise exception 'No tienes permiso para ver estos pedidos.' using errcode = '42501';
  end if;

  with pedidos_periodo as (
    select p.*
    from public.pedidos_whatsapp p
    where p.negocio_id = p_negocio_id
      and p.created_at >= now() - make_interval(days => v_periodo)
  ),
  resumen as (
    select
      count(*)::integer as total,
      count(*) filter (where estado in ('enviado_whatsapp', 'nuevo'))::integer as nuevos,
      count(*) filter (where estado = 'contactado')::integer as contactados,
      count(*) filter (where estado = 'completado')::integer as completados,
      count(*) filter (where estado = 'cancelado')::integer as cancelados
    from pedidos_periodo
  ),
  articulos as (
    select
      coalesce(nullif(trim(item->>'nombre'), ''), 'Artículo') as nombre,
      coalesce(nullif(trim(item->>'tipo'), ''), 'producto') as tipo,
      sum(
        case
          when coalesce(item->>'cantidad', '') ~ '^[0-9]+$'
            then greatest(1, (item->>'cantidad')::integer)
          else 1
        end
      )::integer as unidades
    from pedidos_periodo p
    cross join lateral jsonb_array_elements(
      case when jsonb_typeof(p.items) = 'array' then p.items else '[]'::jsonb end
    ) item
    group by 1, 2
    order by unidades desc, nombre asc
    limit 5
  )
  select jsonb_build_object(
    'periodo_dias', v_periodo,
    'total', r.total,
    'nuevos', r.nuevos,
    'contactados', r.contactados,
    'completados', r.completados,
    'cancelados', r.cancelados,
    'top_items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'nombre', a.nombre,
        'tipo', a.tipo,
        'unidades', a.unidades
      ) order by a.unidades desc, a.nombre asc)
      from articulos a
    ), '[]'::jsonb)
  )
  into v_resultado
  from resumen r;

  return coalesce(v_resultado, jsonb_build_object(
    'periodo_dias', v_periodo,
    'total', 0,
    'nuevos', 0,
    'contactados', 0,
    'completados', 0,
    'cancelados', 0,
    'top_items', '[]'::jsonb
  ));
end;
$$;

revoke all on function public.mis_resumen_pedidos_romahub(uuid, integer) from public;
grant execute on function public.mis_resumen_pedidos_romahub(uuid, integer) to authenticated;

comment on function public.mis_resumen_pedidos_romahub(uuid, integer) is
  'Resumen privado de pedidos y artículos más solicitados para la dueña del negocio.';

notify pgrst, 'reload schema';
