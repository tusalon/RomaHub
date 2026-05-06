-- Permisos temporales para gestionar tienda desde el panel estatico.
-- ADVERTENCIA: esto permite crear/editar productos y cursos con la anon key.
-- Usarlo solo mientras se implementa Supabase Auth por negocio.

drop policy if exists "Productos tienda insert anon temporal" on public.productos;
create policy "Productos tienda insert anon temporal"
on public.productos
for insert
with check (true);

drop policy if exists "Productos tienda update anon temporal" on public.productos;
create policy "Productos tienda update anon temporal"
on public.productos
for update
using (true)
with check (true);

drop policy if exists "Cursos tienda insert anon temporal" on public.cursos;
create policy "Cursos tienda insert anon temporal"
on public.cursos
for insert
with check (true);

drop policy if exists "Cursos tienda update anon temporal" on public.cursos;
create policy "Cursos tienda update anon temporal"
on public.cursos
for update
using (true)
with check (true);
