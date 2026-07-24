-- RomaHub F5 - Reportes de tiendas/negocios (moderacion)
-- Ejecutar en Supabase SQL Editor.
--
-- Cualquiera puede REPORTAR (insert publico, sin login) desde el perfil de
-- un negocio en RomaHub. Solo el SuperAdmin (rservasroma@gmail.com, el mismo
-- email que ya usa Rservas.SuperAdmin) puede LEER o resolver los reportes.
-- Los duenos de tienda (que tambien tienen cuentas 'authenticated' desde
-- F2/activar-tienda-romahub) quedan explicitamente fuera de la lectura:
-- sin esto, cualquier vendedor podria leer los reportes de todos.

create table if not exists public.reportes_tienda (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  motivo text not null,
  detalle text,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'resuelto', 'descartado')),
  created_at timestamptz not null default now()
);

create index if not exists reportes_tienda_negocio_idx on public.reportes_tienda(negocio_id);
create index if not exists reportes_tienda_estado_idx on public.reportes_tienda(estado);

alter table public.reportes_tienda enable row level security;

drop policy if exists "Cualquiera puede reportar" on public.reportes_tienda;
create policy "Cualquiera puede reportar"
on public.reportes_tienda
for insert
to anon, authenticated
with check (true);

drop policy if exists "Solo superadmin lee reportes" on public.reportes_tienda;
create policy "Solo superadmin lee reportes"
on public.reportes_tienda
for select
to authenticated
using (auth.jwt() ->> 'email' = 'rservasroma@gmail.com');

drop policy if exists "Solo superadmin actualiza reportes" on public.reportes_tienda;
create policy "Solo superadmin actualiza reportes"
on public.reportes_tienda
for update
to authenticated
using (auth.jwt() ->> 'email' = 'rservasroma@gmail.com')
with check (auth.jwt() ->> 'email' = 'rservasroma@gmail.com');
