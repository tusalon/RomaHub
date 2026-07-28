-- RomaHub: corrige las políticas del panel para productos y cursos.
--
-- En producción faltaban las políticas SELECT del propietario: los productos
-- activos se veían por la política pública, pero al cambiarlos a inactivos la
-- fila nueva dejaba de ser visible y Postgres devolvía 42501. Esta función
-- SECURITY DEFINER centraliza la comprobación del vínculo autenticado y evita
-- depender de consultas RLS anidadas en todas las políticas del catálogo.

create or replace function public.romahub_puede_gestionar_negocio(p_negocio_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.usuarios_negocio as acceso
      where acceso.user_id = (select auth.uid())
        and acceso.negocio_id = p_negocio_id
        and acceso.activo = true
        and acceso.rol in ('dueno', 'admin', 'editor')
    );
$$;

revoke all on function public.romahub_puede_gestionar_negocio(uuid) from public;
grant execute on function public.romahub_puede_gestionar_negocio(uuid) to authenticated;

drop policy if exists "Duenos ven productos de su negocio" on public.productos;
create policy "Duenos ven productos de su negocio"
on public.productos
for select
to authenticated
using ((select public.romahub_puede_gestionar_negocio(productos.negocio_id)));

drop policy if exists "Duenos insertan productos de su negocio" on public.productos;
create policy "Duenos insertan productos de su negocio"
on public.productos
for insert
to authenticated
with check ((select public.romahub_puede_gestionar_negocio(productos.negocio_id)));

drop policy if exists "Duenos actualizan productos de su negocio" on public.productos;
create policy "Duenos actualizan productos de su negocio"
on public.productos
for update
to authenticated
using ((select public.romahub_puede_gestionar_negocio(productos.negocio_id)))
with check ((select public.romahub_puede_gestionar_negocio(productos.negocio_id)));

drop policy if exists "Duenos ven cursos de su negocio" on public.cursos;
create policy "Duenos ven cursos de su negocio"
on public.cursos
for select
to authenticated
using ((select public.romahub_puede_gestionar_negocio(cursos.negocio_id)));

drop policy if exists "Duenos insertan cursos de su negocio" on public.cursos;
create policy "Duenos insertan cursos de su negocio"
on public.cursos
for insert
to authenticated
with check ((select public.romahub_puede_gestionar_negocio(cursos.negocio_id)));

drop policy if exists "Duenos actualizan cursos de su negocio" on public.cursos;
create policy "Duenos actualizan cursos de su negocio"
on public.cursos
for update
to authenticated
using ((select public.romahub_puede_gestionar_negocio(cursos.negocio_id)))
with check ((select public.romahub_puede_gestionar_negocio(cursos.negocio_id)));

notify pgrst, 'reload schema';
