-- Normaliza nueve municipios correctos que conservaban espacios finales o
-- diferencias de mayusculas de la entrada libre anterior.

do $$
declare
  v_actualizados integer;
begin
  update public.negocios as n
  set municipio = correcciones.municipio_nuevo
  from (
    values
      ('56a67bfa-0811-4dd6-88d4-2ba542f7bf2a'::uuid, 'Artemisa', 'San Antonio de los baños ', 'San Antonio de los Baños'),
      ('d3603d5d-c64a-4151-873c-8b926c556da4'::uuid, 'La Habana', 'Boyeros ', 'Boyeros'),
      ('79fb5647-0c68-41d8-be77-9ad931bbdb49'::uuid, 'Camagüey', 'Camagüey ', 'Camagüey'),
      ('87143675-9146-43f1-9e41-09a9d12766b0'::uuid, 'Santiago de Cuba', 'Santiago de Cuba ', 'Santiago de Cuba'),
      ('5793c017-4288-4371-b450-b2a357a15b68'::uuid, 'Las Tunas', 'Manatí ', 'Manatí'),
      ('1edbef0a-5715-4ead-b7aa-daa5fe11922b'::uuid, 'Cienfuegos', 'Cienfuegos ', 'Cienfuegos'),
      ('113a6f79-5f6b-4c33-a730-a5bb2fc4739c'::uuid, 'Holguín', 'Holguín ', 'Holguín'),
      ('cf522698-af33-4208-987c-3f0f5f821a4d'::uuid, 'Camagüey', 'Camagüey ', 'Camagüey'),
      ('5ff3dd1b-56e7-479a-9a4a-e6a1c1780231'::uuid, 'Santiago de Cuba', 'Palma Soriano ', 'Palma Soriano')
  ) as correcciones(id, provincia, municipio_anterior, municipio_nuevo)
  where n.id = correcciones.id
    and n.provincia = correcciones.provincia
    and n.municipio = correcciones.municipio_anterior;

  get diagnostics v_actualizados = row_count;
  if v_actualizados <> 9 then
    raise exception 'Se esperaban 9 municipios para normalizar, pero coincidieron %.', v_actualizados;
  end if;
end;
$$;

notify pgrst, 'reload schema';
