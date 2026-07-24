-- RomaHub - Límite de 40 productos/cursos activos por tienda EXTERNA.
-- Ejecutar en Supabase SQL Editor.
--
-- Se hace con un trigger (no solo en el panel/JS) porque el panel manda al
-- API REST de Postgres directamente: cualquiera con las credenciales podría
-- saltarse un límite hecho solo en el navegador. El trigger es la barrera
-- real; el aviso en el panel (JS) es solo para que el mensaje sea amable.
--
-- Solo aplica a negocios con es_tienda_externa=true. Los negocios
-- rservasroma (con suscripción) no tienen este límite.
-- Cuenta productos + cursos ACTIVOS combinados (no cuenta los ocultos,
-- para que el vendedor pueda archivar y hacer espacio a nuevos).

create or replace function public.limitar_tienda_externa()
returns trigger
language plpgsql
security definer
as $$
declare
  es_externa boolean;
  total_activos integer;
begin
  select es_tienda_externa into es_externa from public.negocios where id = new.negocio_id;

  if es_externa is true and coalesce(new.activo, true) is true then
    select count(*) into total_activos
    from (
      select id from public.productos where negocio_id = new.negocio_id and activo = true
      union all
      select id from public.cursos where negocio_id = new.negocio_id and activo = true
    ) t;

    if total_activos >= 40 then
      raise exception 'limite_tienda_externa: las tiendas externas pueden tener maximo 40 productos/cursos activos'
        using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_limite_productos on public.productos;
create trigger trg_limite_productos
before insert on public.productos
for each row execute function public.limitar_tienda_externa();

drop trigger if exists trg_limite_cursos on public.cursos;
create trigger trg_limite_cursos
before insert on public.cursos
for each row execute function public.limitar_tienda_externa();
