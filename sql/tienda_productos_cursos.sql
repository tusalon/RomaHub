-- RservasRoma Marketplace - tienda ligera
-- Ejecutar en Supabase SQL Editor.
-- Las imagenes NO se guardan en Supabase: aqui solo se guarda la URL externa
-- de Cloudinary, ImgBB u otro proveedor.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.categorias_tienda (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  nombre text not null,
  tipo text not null check (tipo in ('producto', 'curso')),
  orden integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  categoria_id uuid references public.categorias_tienda(id) on delete set null,
  nombre text not null,
  descripcion text,
  precio numeric(12,2) not null default 0 check (precio >= 0),
  moneda text not null default 'CUP',
  imagen_url text,
  categoria text,
  stock integer not null default 0 check (stock >= 0),
  activo boolean not null default true,
  destacado boolean not null default false,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cursos (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  categoria_id uuid references public.categorias_tienda(id) on delete set null,
  nombre text not null,
  descripcion text,
  precio numeric(12,2) not null default 0 check (precio >= 0),
  moneda text not null default 'CUP',
  imagen_url text,
  categoria text,
  modalidad text not null default 'presencial',
  fecha timestamptz,
  duracion text,
  ubicacion text,
  cupos integer check (cupos is null or cupos >= 0),
  activo boolean not null default true,
  destacado boolean not null default false,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pedidos_whatsapp (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid references public.negocios(id) on delete set null,
  cliente_nombre text,
  cliente_whatsapp text,
  items jsonb not null default '[]'::jsonb,
  total numeric(12,2) not null default 0,
  estado text not null default 'enviado_whatsapp',
  created_at timestamptz not null default now()
);

create index if not exists categorias_tienda_negocio_idx on public.categorias_tienda(negocio_id);
create index if not exists categorias_tienda_activo_idx on public.categorias_tienda(activo);
create index if not exists productos_negocio_idx on public.productos(negocio_id);
create index if not exists productos_activo_idx on public.productos(activo);
create index if not exists productos_orden_idx on public.productos(negocio_id, destacado desc, orden asc, nombre asc);
create index if not exists cursos_negocio_idx on public.cursos(negocio_id);
create index if not exists cursos_activo_idx on public.cursos(activo);
create index if not exists cursos_orden_idx on public.cursos(negocio_id, destacado desc, orden asc, fecha asc, nombre asc);
create index if not exists pedidos_whatsapp_negocio_idx on public.pedidos_whatsapp(negocio_id);
create index if not exists pedidos_whatsapp_created_idx on public.pedidos_whatsapp(created_at desc);

drop trigger if exists categorias_tienda_set_updated_at on public.categorias_tienda;
create trigger categorias_tienda_set_updated_at
before update on public.categorias_tienda
for each row execute function public.set_updated_at();

drop trigger if exists productos_set_updated_at on public.productos;
create trigger productos_set_updated_at
before update on public.productos
for each row execute function public.set_updated_at();

drop trigger if exists cursos_set_updated_at on public.cursos;
create trigger cursos_set_updated_at
before update on public.cursos
for each row execute function public.set_updated_at();

alter table public.categorias_tienda enable row level security;
alter table public.productos enable row level security;
alter table public.cursos enable row level security;
alter table public.pedidos_whatsapp enable row level security;

drop policy if exists "Categorias tienda publicas" on public.categorias_tienda;
create policy "Categorias tienda publicas"
on public.categorias_tienda
for select
using (activo = true);

drop policy if exists "Productos activos publicos" on public.productos;
create policy "Productos activos publicos"
on public.productos
for select
using (activo = true);

drop policy if exists "Cursos activos publicos" on public.cursos;
create policy "Cursos activos publicos"
on public.cursos
for select
using (activo = true);

drop policy if exists "Pedidos whatsapp publicos" on public.pedidos_whatsapp;
create policy "Pedidos whatsapp publicos"
on public.pedidos_whatsapp
for insert
to anon
with check (
  negocio_id is not null
  and length(trim(cliente_nombre)) between 2 and 120
  and cliente_whatsapp ~ '^[0-9]{8,15}$'
  and jsonb_typeof(items) = 'array'
  and jsonb_array_length(items) between 1 and 50
  and total > 0
  and total <= 10000000
  and estado = 'enviado_whatsapp'
  and exists (
    select 1
    from public.negocios n
    where n.id = pedidos_whatsapp.negocio_id
      and n.configurado = true
  )
);

-- Opcional para probar rapido:
-- insert into public.productos (negocio_id, nombre, descripcion, precio, imagen_url, stock, activo)
-- values ('56a67bfa-0811-4dd6-88d4-2ba542f7bf2a', 'Aceite de cuticula', 'Producto de prueba', 500, 'https://res.cloudinary.com/tu-cloud/image/upload/ejemplo.jpg', 10, true);
