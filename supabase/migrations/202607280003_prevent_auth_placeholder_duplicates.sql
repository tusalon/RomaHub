-- Evita que los usuarios tecnicos de RomaHub creen un segundo negocio vacio.
--
-- Las Edge Functions de RomaHub crean usuarios con el dominio interno
-- whatsapp.rservasroma.local y despues los enlazan a un negocio existente o
-- crean la tienda externa definitiva. El trigger generico de auth.users no
-- debe crear "Pendiente de completar" para esas cuentas tecnicas.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(coalesce(new.email, '')) like '%@whatsapp.rservasroma.local'
     or lower(coalesce(new.raw_user_meta_data ->> 'skip_negocio_autocreate', 'false'))
        in ('true', '1', 'yes') then
    return new;
  end if;

  insert into public.negocios (
    id,
    nombre,
    email,
    telefono,
    plan
  ) values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'nombre_negocio'), ''), 'Pendiente de completar'),
    new.email,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'telefono'), ''), '00000000'),
    'gratuito'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

comment on function public.handle_new_user() is
  'Crea negocios para altas normales y omite usuarios tecnicos enlazados por RomaHub.';
