-- RomaHub - Tiendas externas (instalación base)
-- Ejecutar en Supabase SQL Editor.
--
-- Permite que personas sin cuenta de Rservasroma tengan un perfil y una
-- tienda. La contraseña nunca se almacena en texto legible.

alter table public.negocios
  add column if not exists es_tienda_externa boolean not null default false;

create index if not exists negocios_es_tienda_externa_idx
  on public.negocios (es_tienda_externa)
  where es_tienda_externa = true;

create table if not exists public.tiendas_credenciales (
  negocio_id               uuid primary key references public.negocios(id) on delete cascade,
  user_id                  uuid references auth.users(id) on delete set null,
  usuario                  text not null,
  password_recuperacion    text,
  whatsapp                 text,
  codigo_recuperacion_hash text,
  codigo_actualizado_at    timestamptz,
  intentos_fallidos        integer not null default 0,
  bloqueado_hasta          timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

alter table public.tiendas_credenciales enable row level security;

comment on table public.tiendas_credenciales is
  'Recuperación segura de tiendas externas. RLS cerrada: solo service_role; nunca contiene contraseñas legibles.';
