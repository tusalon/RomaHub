-- RomaHub - Personalizacion del perfil y organizacion de servicios.
-- Ejecutar una vez en Supabase SQL Editor.
--
-- Permite a la duena autenticada ajustar la descripcion y el encuadre de la
-- portada, y ordenar/agrupar sus propios servicios. Nombre, WhatsApp, logo y
-- campos administrativos quedan fuera de estas funciones.

alter table public.negocios
  add column if not exists imagen_fondo_pos_x numeric(5,2) not null default 50
    check (imagen_fondo_pos_x between 0 and 100),
  add column if not exists imagen_fondo_pos_y numeric(5,2) not null default 50
    check (imagen_fondo_pos_y between 0 and 100);

alter table public.servicios
  add column if not exists orden integer not null default 0;

create index if not exists servicios_negocio_orden_idx
  on public.servicios (negocio_id, orden, nombre);

create or replace function public.guardar_mi_presentacion_negocio(
  p_negocio_id uuid,
  p_mensaje_bienvenida text,
  p_imagen_fondo_pos_x numeric,
  p_imagen_fondo_pos_y numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_resultado jsonb;
begin
  if auth.uid() is null then
    raise exception 'Inicia sesion para continuar.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.usuarios_negocio u
    where u.user_id = auth.uid()
      and u.negocio_id = p_negocio_id
      and u.activo = true
      and u.rol in ('dueno', 'admin')
  ) then
    raise exception 'No tienes permiso para editar este negocio.' using errcode = '42501';
  end if;

  update public.negocios
  set
    mensaje_bienvenida = nullif(left(trim(coalesce(p_mensaje_bienvenida, '')), 600), ''),
    imagen_fondo_pos_x = greatest(0, least(100, coalesce(p_imagen_fondo_pos_x, 50))),
    imagen_fondo_pos_y = greatest(0, least(100, coalesce(p_imagen_fondo_pos_y, 50)))
  where id = p_negocio_id
  returning jsonb_build_object(
    'mensaje_bienvenida', mensaje_bienvenida,
    'imagen_fondo_pos_x', imagen_fondo_pos_x,
    'imagen_fondo_pos_y', imagen_fondo_pos_y
  ) into v_resultado;

  if v_resultado is null then
    raise exception 'No se encontro el negocio.' using errcode = 'P0002';
  end if;

  return v_resultado;
end;
$$;

create or replace function public.organizar_mis_servicios(
  p_negocio_id uuid,
  p_servicios jsonb
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_item jsonb;
  v_id uuid;
  v_total integer := 0;
begin
  if auth.uid() is null then
    raise exception 'Inicia sesion para continuar.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.usuarios_negocio u
    where u.user_id = auth.uid()
      and u.negocio_id = p_negocio_id
      and u.activo = true
      and u.rol in ('dueno', 'admin')
  ) then
    raise exception 'No tienes permiso para organizar estos servicios.' using errcode = '42501';
  end if;

  if jsonb_typeof(p_servicios) <> 'array' or jsonb_array_length(p_servicios) > 300 then
    raise exception 'La lista de servicios no es valida.' using errcode = '22023';
  end if;

  for v_item in select value from jsonb_array_elements(p_servicios)
  loop
    begin
      v_id := (v_item ->> 'id')::uuid;
    exception when others then
      raise exception 'Hay un servicio con identificador invalido.' using errcode = '22023';
    end;

    update public.servicios
    set
      categoria = nullif(left(trim(coalesce(v_item ->> 'categoria', '')), 80), ''),
      orden = greatest(0, least(10000, coalesce((v_item ->> 'orden')::integer, v_total)))
    where id = v_id
      and negocio_id = p_negocio_id;

    if not found then
      raise exception 'Uno de los servicios no pertenece a tu negocio.' using errcode = '42501';
    end if;

    v_total := v_total + 1;
  end loop;

  return v_total;
end;
$$;

revoke all on function public.guardar_mi_presentacion_negocio(uuid, text, numeric, numeric) from public;
revoke all on function public.organizar_mis_servicios(uuid, jsonb) from public;

grant execute on function public.guardar_mi_presentacion_negocio(uuid, text, numeric, numeric) to authenticated;
grant execute on function public.organizar_mis_servicios(uuid, jsonb) to authenticated;

notify pgrst, 'reload schema';
