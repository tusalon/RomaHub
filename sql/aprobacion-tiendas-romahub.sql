-- RomaHub - Aprobacion de tiendas externas antes de publicarlas.
-- Ejecutar en Supabase SQL Editor.
--
-- Hoy una tienda externa se crea con configurado=true: es publica en el
-- mismo segundo, sin un solo producto y sin que nadie la revise. Esto anade
-- un estado de moderacion (borrador -> en_revision -> aprobada/rechazada) y
-- deja "configurado" bajo control exclusivo del service_role para tiendas
-- externas, para que ni la propia edge function con anon key ni el panel de
-- la duena puedan saltarse la revision.

alter table public.negocios
  add column if not exists romahub_estado text not null default 'aprobada'
    check (romahub_estado in ('borrador', 'en_revision', 'aprobada', 'rechazada')),
  add column if not exists romahub_enviado_at timestamptz,
  add column if not exists romahub_revisado_at timestamptz,
  add column if not exists romahub_nota_rechazo text;

comment on column public.negocios.romahub_estado is
  'Solo aplica a es_tienda_externa=true. borrador/en_revision no se muestran en RomaHub; aprobada si. El default aprobada deja intactos los negocios existentes.';

create index if not exists negocios_romahub_estado_idx
  on public.negocios (romahub_estado)
  where es_tienda_externa = true;

-- ── RPC: la duena envia su tienda a revision ──────────────────────────────
create or replace function public.enviar_tienda_a_revision(p_negocio_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_negocio record;
  v_total_activos integer;
begin
  if not public.romahub_puede_gestionar_negocio(p_negocio_id) then
    raise exception 'No tienes permiso para gestionar este negocio.' using errcode = '42501';
  end if;

  select id, es_tienda_externa, romahub_estado, logo_url, provincia, municipio, mensaje_bienvenida
  into v_negocio
  from public.negocios
  where id = p_negocio_id;

  if v_negocio.id is null then
    raise exception 'No se encontro el negocio.' using errcode = 'P0002';
  end if;

  if v_negocio.es_tienda_externa is not true then
    raise exception 'Este negocio no necesita revision.' using errcode = 'P0001';
  end if;

  if v_negocio.romahub_estado not in ('borrador', 'rechazada') then
    raise exception 'La tienda ya esta en revision o aprobada.' using errcode = 'P0001';
  end if;

  if coalesce(v_negocio.logo_url, '') = '' then
    raise exception 'Sube el logo de tu tienda antes de enviarla a revision.' using errcode = 'P0001';
  end if;
  if coalesce(v_negocio.provincia, '') = '' or coalesce(v_negocio.municipio, '') = '' then
    raise exception 'Completa provincia y municipio antes de enviar tu tienda.' using errcode = 'P0001';
  end if;
  if coalesce(trim(v_negocio.mensaje_bienvenida), '') = '' then
    raise exception 'Escribe una descripcion de tu tienda.' using errcode = 'P0001';
  end if;

  select count(*) into v_total_activos
  from (
    select id from public.productos where negocio_id = p_negocio_id and activo = true
    union all
    select id from public.cursos where negocio_id = p_negocio_id and activo = true
  ) t;

  if v_total_activos < 3 then
    raise exception 'Sube al menos 3 productos o cursos activos antes de enviar tu tienda a revision.' using errcode = 'P0001';
  end if;

  update public.negocios
  set romahub_estado = 'en_revision',
      romahub_enviado_at = now(),
      romahub_nota_rechazo = null
  where id = p_negocio_id;

  return jsonb_build_object('romahub_estado', 'en_revision');
end;
$$;

revoke all on function public.enviar_tienda_a_revision(uuid) from public;
grant execute on function public.enviar_tienda_a_revision(uuid) to authenticated;

-- ── Trigger: solo service_role puede publicar o aprobar una tienda externa ─
-- El panel de la duena y la edge function de alta usan anon/authenticated;
-- ninguno de los dos debe poder poner configurado=true ni
-- romahub_estado=aprobada en un negocio es_tienda_externa=true. Solo el
-- SuperAdmin (con service_role) puede hacerlo, tras revisar los productos.
create or replace function public.proteger_aprobacion_romahub()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.es_tienda_externa is true and (select auth.role()) <> 'service_role' then
    if new.configurado is true and coalesce(old.configurado, false) is false then
      raise exception 'Solo el equipo de RomaHub puede publicar una tienda externa.' using errcode = '42501';
    end if;
    if new.romahub_estado = 'aprobada' and coalesce(old.romahub_estado, '') <> 'aprobada' then
      raise exception 'Solo el equipo de RomaHub puede aprobar una tienda externa.' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_proteger_aprobacion_romahub on public.negocios;
create trigger trg_proteger_aprobacion_romahub
before update on public.negocios
for each row execute function public.proteger_aprobacion_romahub();

notify pgrst, 'reload schema';
