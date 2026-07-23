-- Seguridad real para el panel de tiendas RservasRoma.
-- 1) Crea el usuario en Supabase Auth usando este correo técnico:
--    53XXXXXXXX@whatsapp.rservasroma.local
--    Ejemplo para +53 54066204: 5354066204@whatsapp.rservasroma.local
-- 2) Busca su id en auth.users.
-- 3) Inserta el enlace usuario <-> negocio al final de este archivo.

create table if not exists public.usuarios_negocio (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  rol text not null default 'dueno' check (rol in ('dueno', 'admin', 'editor')),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, negocio_id)
);

create index if not exists usuarios_negocio_user_idx on public.usuarios_negocio(user_id);
create index if not exists usuarios_negocio_negocio_idx on public.usuarios_negocio(negocio_id);

alter table public.usuarios_negocio enable row level security;

drop policy if exists "Usuario ve sus negocios" on public.usuarios_negocio;
create policy "Usuario ve sus negocios"
on public.usuarios_negocio
for select
to authenticated
using (auth.uid() = user_id and activo = true);

-- Quitar permisos temporales públicos del panel.
drop policy if exists "Productos tienda insert anon temporal" on public.productos;
drop policy if exists "Productos tienda update anon temporal" on public.productos;
drop policy if exists "Cursos tienda insert anon temporal" on public.cursos;
drop policy if exists "Cursos tienda update anon temporal" on public.cursos;

-- Los SELECT públicos de productos/cursos activos se mantienen desde tienda_productos_cursos.sql.
-- Estas políticas extra permiten al dueño ver también elementos inactivos de su negocio.
drop policy if exists "Duenos ven productos de su negocio" on public.productos;
create policy "Duenos ven productos de su negocio"
on public.productos
for select
to authenticated
using (
  exists (
    select 1
    from public.usuarios_negocio u
    where u.negocio_id = productos.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
  )
);

drop policy if exists "Duenos insertan productos de su negocio" on public.productos;
create policy "Duenos insertan productos de su negocio"
on public.productos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.usuarios_negocio u
    where u.negocio_id = productos.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
  )
);

drop policy if exists "Duenos actualizan productos de su negocio" on public.productos;
create policy "Duenos actualizan productos de su negocio"
on public.productos
for update
to authenticated
using (
  exists (
    select 1
    from public.usuarios_negocio u
    where u.negocio_id = productos.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
  )
)
with check (
  exists (
    select 1
    from public.usuarios_negocio u
    where u.negocio_id = productos.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
  )
);

drop policy if exists "Duenos ven cursos de su negocio" on public.cursos;
create policy "Duenos ven cursos de su negocio"
on public.cursos
for select
to authenticated
using (
  exists (
    select 1
    from public.usuarios_negocio u
    where u.negocio_id = cursos.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
  )
);

drop policy if exists "Duenos insertan cursos de su negocio" on public.cursos;
create policy "Duenos insertan cursos de su negocio"
on public.cursos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.usuarios_negocio u
    where u.negocio_id = cursos.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
  )
);

drop policy if exists "Duenos actualizan cursos de su negocio" on public.cursos;
create policy "Duenos actualizan cursos de su negocio"
on public.cursos
for update
to authenticated
using (
  exists (
    select 1
    from public.usuarios_negocio u
    where u.negocio_id = cursos.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
  )
)
with check (
  exists (
    select 1
    from public.usuarios_negocio u
    where u.negocio_id = cursos.negocio_id
      and u.user_id = auth.uid()
      and u.activo = true
  )
);

-- Ejemplo para enlazar una cuenta Auth con un negocio:
-- select id, email from auth.users where email = '5354066204@whatsapp.rservasroma.local';
-- insert into public.usuarios_negocio (user_id, negocio_id, rol)
-- values ('UUID_DEL_USUARIO_AUTH', 'UUID_DEL_NEGOCIO', 'dueno')
-- on conflict (user_id, negocio_id) do update set activo = true, rol = excluded.rol;
