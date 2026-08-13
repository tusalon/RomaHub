-- Amplia la excepcion del trigger que crea negocios "Pendiente de completar".
--
-- 202607280003 ya se saltaba las cuentas @whatsapp.rservasroma.local y las que
-- traen skip_negocio_autocreate. Se siguieron colando dos fuentes:
--
--   * RomaCrece: login-rservasroma usa generateLink('magiclink') con el correo
--     romacrece.<negocio_id>@auth.romahub.app. generateLink crea la cuenta si no
--     existe, asi que la primera entrada de cada salon duplicaba su negocio.
--   * Cuentas de prueba en dominios .test / .local, que acababan en produccion.
--
-- Los dominios .test y .local son TLD reservados (RFC 6761 / RFC 2606): ningun
-- salon real puede tener un correo ahi, asi que descartarlos no pierde altas.
--
-- La bandera skip_negocio_autocreate sigue siendo la via preferida; esto es la
-- red de seguridad para cuando una app nueva se olvide de ponerla.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  correo text := lower(coalesce(new.email, ''));
begin
  if correo like '%@whatsapp.rservasroma.local'
     or correo like '%@auth.romahub.app'
     or correo like '%.test'
     or correo like '%.local'
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
  'Crea negocios para altas normales y omite cuentas tecnicas (RomaHub, RomaCrece, dominios .test/.local) y las marcadas con skip_negocio_autocreate.';
