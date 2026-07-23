-- OBSOLETO: este archivo ya no abre permisos anonimos.
-- Se conserva solo como cierre seguro por si las politicas temporales fueron creadas antes.
-- Ejecutar sql/tienda_panel_auth_rls.sql para usar acceso real por negocio.

drop policy if exists "Productos tienda insert anon temporal" on public.productos;
drop policy if exists "Productos tienda update anon temporal" on public.productos;
drop policy if exists "Cursos tienda insert anon temporal" on public.cursos;
drop policy if exists "Cursos tienda update anon temporal" on public.cursos;
