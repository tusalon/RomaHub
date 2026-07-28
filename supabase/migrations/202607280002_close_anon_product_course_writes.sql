-- RomaHub: elimina definitivamente los permisos temporales del panel.
-- La tienda pública solo necesita leer productos y cursos activos. Crear o
-- actualizar contenido requiere una sesión autenticada y las políticas de
-- propiedad instaladas en la migración anterior.

drop policy if exists "Productos tienda insert anon temporal" on public.productos;
drop policy if exists "Productos tienda update anon temporal" on public.productos;
drop policy if exists "Cursos tienda insert anon temporal" on public.cursos;
drop policy if exists "Cursos tienda update anon temporal" on public.cursos;

revoke insert, update, delete, truncate, references, trigger
on table public.productos, public.cursos
from public, anon;

grant select on table public.productos, public.cursos to anon, authenticated;
grant insert, update on table public.productos, public.cursos to authenticated;

notify pgrst, 'reload schema';
