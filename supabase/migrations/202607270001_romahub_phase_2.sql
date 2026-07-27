-- RomaHub - Fase 2: seguridad, recuperación y edición completa de tiendas externas.

alter table public.tiendas_credenciales
  alter column password_recuperacion drop not null,
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists codigo_recuperacion_hash text,
  add column if not exists codigo_actualizado_at timestamptz,
  add column if not exists intentos_fallidos integer not null default 0,
  add column if not exists bloqueado_hasta timestamptz,
  add column if not exists updated_at timestamptz not null default now();

update public.tiendas_credenciales
set password_recuperacion = null
where password_recuperacion is not null;

comment on column public.tiendas_credenciales.password_recuperacion is
  'Obsoleto. Debe permanecer NULL; RomaHub nunca guarda contraseñas en texto legible.';
comment on column public.tiendas_credenciales.codigo_recuperacion_hash is
  'Huella irreversible del código de recuperación mostrado una sola vez al propietario.';

create table if not exists public.romahub_rate_limits (
  clave_hash text not null,
  accion text not null,
  ventana_inicio timestamptz not null default now(),
  contador integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (clave_hash, accion)
);

alter table public.romahub_rate_limits enable row level security;

create or replace function public.consumir_limite_romahub(
  p_clave_hash text,
  p_accion text,
  p_limite integer,
  p_ventana_segundos integer
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_contador integer;
  v_ventana interval;
begin
  if length(coalesce(p_clave_hash, '')) <> 64 or length(coalesce(p_accion, '')) < 2 then
    return false;
  end if;

  v_ventana := make_interval(secs => greatest(60, least(86400, p_ventana_segundos)));

  insert into public.romahub_rate_limits (clave_hash, accion, ventana_inicio, contador, updated_at)
  values (p_clave_hash, left(p_accion, 60), now(), 1, now())
  on conflict (clave_hash, accion) do update
  set
    contador = case
      when public.romahub_rate_limits.ventana_inicio <= now() - v_ventana then 1
      else public.romahub_rate_limits.contador + 1
    end,
    ventana_inicio = case
      when public.romahub_rate_limits.ventana_inicio <= now() - v_ventana then now()
      else public.romahub_rate_limits.ventana_inicio
    end,
    updated_at = now()
  returning contador into v_contador;

  return v_contador <= greatest(1, least(1000, p_limite));
end;
$$;

revoke all on function public.consumir_limite_romahub(text, text, integer, integer) from public;
grant execute on function public.consumir_limite_romahub(text, text, integer, integer) to service_role;

create or replace function public.guardar_mi_perfil_romahub(
  p_negocio_id uuid,
  p_nombre text,
  p_whatsapp text,
  p_especialidad text,
  p_provincia text,
  p_municipio text,
  p_mensaje_bienvenida text,
  p_logo_url text,
  p_imagen_fondo_url text,
  p_imagen_fondo_pos_x numeric,
  p_imagen_fondo_pos_y numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_externa boolean;
  v_whatsapp text;
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
    raise exception 'No tienes permiso para editar este negocio.' using errcode = '42501';
  end if;

  select es_tienda_externa into v_externa
  from public.negocios where id = p_negocio_id;

  if v_externa is null then
    raise exception 'No se encontro el negocio.' using errcode = 'P0002';
  end if;

  v_whatsapp := regexp_replace(coalesce(p_whatsapp, ''), '[^0-9]', '', 'g');
  if v_externa and v_whatsapp !~ '^[0-9]{8}$' then
    raise exception 'Escribe los 8 digitos del WhatsApp cubano.' using errcode = '22023';
  end if;

  update public.negocios
  set
    nombre = case when v_externa then nullif(left(trim(coalesce(p_nombre, '')), 80), '') else nombre end,
    telefono = case when v_externa then v_whatsapp else telefono end,
    especialidad = case when v_externa then coalesce(nullif(left(trim(coalesce(p_especialidad, '')), 80), ''), 'Belleza') else especialidad end,
    provincia = case when v_externa then nullif(left(trim(coalesce(p_provincia, '')), 80), '') else provincia end,
    municipio = case when v_externa then nullif(left(trim(coalesce(p_municipio, '')), 100), '') else municipio end,
    logo_url = case when v_externa then nullif(left(trim(coalesce(p_logo_url, '')), 1000), '') else logo_url end,
    imagen_fondo_url = case when v_externa then nullif(left(trim(coalesce(p_imagen_fondo_url, '')), 1000), '') else imagen_fondo_url end,
    mensaje_bienvenida = nullif(left(trim(coalesce(p_mensaje_bienvenida, '')), 600), ''),
    imagen_fondo_pos_x = greatest(0, least(100, coalesce(p_imagen_fondo_pos_x, 50))),
    imagen_fondo_pos_y = greatest(0, least(100, coalesce(p_imagen_fondo_pos_y, 50)))
  where id = p_negocio_id
  returning jsonb_build_object(
    'nombre', nombre,
    'telefono', telefono,
    'especialidad', especialidad,
    'provincia', provincia,
    'municipio', municipio,
    'mensaje_bienvenida', mensaje_bienvenida,
    'logo_url', logo_url,
    'imagen_fondo_url', imagen_fondo_url,
    'imagen_fondo_pos_x', imagen_fondo_pos_x,
    'imagen_fondo_pos_y', imagen_fondo_pos_y,
    'es_tienda_externa', es_tienda_externa
  ) into v_resultado;

  return v_resultado;
end;
$$;

revoke all on function public.guardar_mi_perfil_romahub(uuid, text, text, text, text, text, text, text, text, numeric, numeric) from public;
grant execute on function public.guardar_mi_perfil_romahub(uuid, text, text, text, text, text, text, text, text, numeric, numeric) to authenticated;

notify pgrst, 'reload schema';
