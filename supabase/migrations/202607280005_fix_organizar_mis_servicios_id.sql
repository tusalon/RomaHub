-- Corrige el tipo del identificador en organizar_mis_servicios.
--
-- La version original (sql/personalizar-perfil-servicios.sql) asumia que
-- servicios.id era uuid, pero es bigint. Eso rompia la funcion de dos formas:
--
--   1) (v_item ->> 'id')::uuid fallaba al convertir un id como '1196',
--      y el bloque exception lo traducia a "Hay un servicio con
--      identificador invalido." — un mensaje que despistaba, porque el id
--      era correcto y el equivocado era el tipo esperado.
--   2) Aun superando el cast, "where id = v_id" comparaba bigint con uuid,
--      y ese operador no existe en Postgres.
--
-- Resultado: ordenar y agrupar servicios nunca funciono para ninguna fila
-- real. Aqui se recrea la funcion con bigint. La firma publica no cambia
-- (uuid, jsonb), asi que el panel no necesita ningun ajuste.
--
-- No se edita el archivo original a proposito: ya se aplico en la base y
-- reescribirlo dejaria el historial mintiendo sobre lo que se ejecuto.

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
  v_id bigint;
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
      v_id := (v_item ->> 'id')::bigint;
    exception when others then
      raise exception 'Hay un servicio con identificador invalido.' using errcode = '22023';
    end;

    -- Sin este control, un id ausente daria NULL, no coincidiria con ninguna
    -- fila y el error final acusaria al servicio de ser de otro negocio.
    if v_id is null then
      raise exception 'Hay un servicio sin identificador.' using errcode = '22023';
    end if;

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

-- create or replace conserva los permisos existentes, pero se repiten para
-- que esta migracion tambien sirva sobre una base recien creada.
revoke all on function public.organizar_mis_servicios(uuid, jsonb) from public;
grant execute on function public.organizar_mis_servicios(uuid, jsonb) to authenticated;

comment on function public.organizar_mis_servicios(uuid, jsonb) is
  'Ordena y agrupa los servicios del negocio autenticado. servicios.id es bigint.';

notify pgrst, 'reload schema';
