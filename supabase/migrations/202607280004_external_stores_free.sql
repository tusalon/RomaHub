-- Las tiendas que usan solamente el marketplace de RomaHub son gratuitas.
-- No pertenecen a un plan de reservas y se distinguen mediante
-- negocios.es_tienda_externa = true.

update public.negocios
set plan = 'gratuito'
where es_tienda_externa = true
  and plan is distinct from 'gratuito';

update public.usuarios_negocio as acceso
set
  estado = 'activo',
  activo = true
from public.negocios as negocio
where negocio.id = acceso.negocio_id
  and negocio.es_tienda_externa = true
  and (
    acceso.estado is distinct from 'activo'
    or acceso.activo is distinct from true
  );

comment on column public.negocios.es_tienda_externa is
  'True para tiendas gratuitas de RomaHub sin agenda de reservas; false para negocios de RservasRoma.';

notify pgrst, 'reload schema';
