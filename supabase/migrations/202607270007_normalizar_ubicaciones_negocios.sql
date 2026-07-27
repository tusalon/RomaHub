-- Correccion puntual de municipios anteriores al selector normalizado de Cuba.
-- Cada UPDATE exige el ID, la provincia y el valor anterior esperado.

do $$
begin
  update public.negocios
  set municipio = 'Habana del Este'
  where id = '55e7df41-6cf7-45d7-9fc3-a17966e3645a'::uuid
    and provincia = 'La Habana'
    and trim(municipio) = 'Habana del Este. Alamar';
  if not found then
    raise exception 'No se pudo validar Exotic Nails by Yuly antes de corregir.';
  end if;

  update public.negocios
  set municipio = 'San Antonio de los Baños'
  where id = '935cc37b-ee0e-4187-9507-4409880a15c2'::uuid
    and provincia = 'Artemisa'
    and trim(municipio) = 'San Antonio';
  if not found then
    raise exception 'No se pudo validar GordisNailsbySandra antes de corregir.';
  end if;

  update public.negocios
  set municipio = 'Cárdenas'
  where id = '59e447a2-d900-4b70-80c7-676bead25d73'::uuid
    and provincia = 'Matanzas'
    and trim(municipio) = 'Varadero';
  if not found then
    raise exception 'No se pudo validar Luxury.moon.varadero antes de corregir.';
  end if;

  update public.negocios
  set municipio = 'Plaza de la Revolución'
  where id = 'd81f3ea8-ad78-4cb8-9898-72c482093327'::uuid
    and provincia = 'La Habana'
    and trim(municipio) = 'Plaza';
  if not found then
    raise exception 'No se pudo validar Nail Lab by Melisa Glez antes de corregir.';
  end if;
end;
$$;

notify pgrst, 'reload schema';
