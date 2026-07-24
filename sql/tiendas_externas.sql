-- RomaHub - Tiendas externas (F1: base de datos)
-- Ejecutar en Supabase SQL Editor.
--
-- Objetivo: permitir que personas SIN cuenta de rservasroma tengan una tienda
-- en el marketplace. Reusa la tabla `negocios` (para heredar productos, panel,
-- perfil y login) marcándolas con un flag, y guarda sus credenciales
-- recuperables en una tabla APARTE con permisos cerrados.

-- 1) Flag de tienda externa en negocios.
--    Los 283 negocios actuales quedan en false: nada cambia para ellos.
--    Una tienda externa se crea con true y SIN fila en `suscripciones`,
--    por eso no lleva diamante y va más abajo en el orden.
alter table public.negocios
  add column if not exists es_tienda_externa boolean not null default false;

-- Índice para filtrar rápido las tiendas externas en el escaparate.
create index if not exists negocios_es_tienda_externa_idx
  on public.negocios (es_tienda_externa)
  where es_tienda_externa = true;

-- 2) Credenciales recuperables de las tiendas externas.
--    Tabla SEPARADA y con RLS CERRADA: la anon key pública NO puede leerla.
--    Solo el service_role (Edge Function de registro y panel SuperAdmin)
--    la escribe/lee, porque service_role omite RLS. Así la contraseña se
--    puede recuperar sin quedar expuesta a cualquiera en internet.
create table if not exists public.tiendas_credenciales (
  negocio_id             uuid primary key references public.negocios(id) on delete cascade,
  usuario                text not null,   -- el slug/identificador de acceso
  password_recuperacion  text not null,   -- contraseña en claro, SOLO visible por SuperAdmin
  whatsapp               text,            -- para recuperar demostrando control del número
  created_at             timestamptz not null default now()
);

-- RLS habilitada SIN policies = nadie con anon/authenticated entra.
-- El service_role omite RLS siempre, así que la Edge Function y el SuperAdmin sí.
alter table public.tiendas_credenciales enable row level security;

-- (Deliberadamente NO se crea ninguna policy: mantener la tabla cerrada.)

comment on table public.tiendas_credenciales is
  'Credenciales recuperables de tiendas externas de RomaHub. RLS cerrada: solo service_role. Nunca exponer por la anon key.';
