-- RomaHub - Arreglo del auth del panel de tiendas
-- Ejecutar en Supabase SQL Editor.
--
-- Problema detectado (2026-07): la tabla usuarios_negocio existe SIN la
-- columna `activo`, pero getBusinessAccess() y todas las RLS policies del
-- panel filtran por `activo = true`. Resultado: la consulta de acceso da
-- error 42703 y NINGÚN dueño (rservasroma o tienda externa) podía entrar al
-- panel ni crear productos. El SQL tienda_panel_auth_rls.sql quedó a medio
-- aplicar (CREATE TABLE IF NOT EXISTS no añade columnas a una tabla vieja).
--
-- Este script es idempotente: añade la columna y (re)crea las policies.

-- 1) La columna que faltaba. default true → las filas existentes quedan activas.
alter table public.usuarios_negocio
  add column if not exists activo boolean not null default true;

-- 2) Policy de lectura de usuarios_negocio (el dueño ve sus vínculos).
drop policy if exists "Usuario ve sus negocios" on public.usuarios_negocio;
create policy "Usuario ve sus negocios"
on public.usuarios_negocio
for select
to authenticated
using (auth.uid() = user_id and activo = true);

-- 3) Policies de productos para dueños (ver / insertar / actualizar los suyos).
drop policy if exists "Duenos ven productos de su negocio" on public.productos;
create policy "Duenos ven productos de su negocio"
on public.productos for select to authenticated
using (exists (select 1 from public.usuarios_negocio u
  where u.negocio_id = productos.negocio_id and u.user_id = auth.uid() and u.activo = true));

drop policy if exists "Duenos insertan productos de su negocio" on public.productos;
create policy "Duenos insertan productos de su negocio"
on public.productos for insert to authenticated
with check (exists (select 1 from public.usuarios_negocio u
  where u.negocio_id = productos.negocio_id and u.user_id = auth.uid() and u.activo = true));

drop policy if exists "Duenos actualizan productos de su negocio" on public.productos;
create policy "Duenos actualizan productos de su negocio"
on public.productos for update to authenticated
using (exists (select 1 from public.usuarios_negocio u
  where u.negocio_id = productos.negocio_id and u.user_id = auth.uid() and u.activo = true))
with check (exists (select 1 from public.usuarios_negocio u
  where u.negocio_id = productos.negocio_id and u.user_id = auth.uid() and u.activo = true));

-- 4) Policies de cursos para dueños (ver / insertar / actualizar los suyos).
drop policy if exists "Duenos ven cursos de su negocio" on public.cursos;
create policy "Duenos ven cursos de su negocio"
on public.cursos for select to authenticated
using (exists (select 1 from public.usuarios_negocio u
  where u.negocio_id = cursos.negocio_id and u.user_id = auth.uid() and u.activo = true));

drop policy if exists "Duenos insertan cursos de su negocio" on public.cursos;
create policy "Duenos insertan cursos de su negocio"
on public.cursos for insert to authenticated
with check (exists (select 1 from public.usuarios_negocio u
  where u.negocio_id = cursos.negocio_id and u.user_id = auth.uid() and u.activo = true));

drop policy if exists "Duenos actualizan cursos de su negocio" on public.cursos;
create policy "Duenos actualizan cursos de su negocio"
on public.cursos for update to authenticated
using (exists (select 1 from public.usuarios_negocio u
  where u.negocio_id = cursos.negocio_id and u.user_id = auth.uid() and u.activo = true))
with check (exists (select 1 from public.usuarios_negocio u
  where u.negocio_id = cursos.negocio_id and u.user_id = auth.uid() and u.activo = true));

-- Refrescar el schema cache de PostgREST (por si acaso).
notify pgrst, 'reload schema';
