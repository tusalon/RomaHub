-- Activar negocios existentes en RomaHub (menos los que sean basura/prueba)
--
-- Contexto: RomaHub exigia "configurado=true" Y una suscripcion activa para
-- que un negocio saliera en el directorio. Se quito esa segunda exigencia en
-- el codigo (data/mockData.js) porque el diamante de verificado nunca
-- dependio de la suscripcion, solo de si es tienda externa o no. Con ese
-- cambio ya desplegado, faltan dos cosas que solo se resuelven con datos:
--
--   1) Un negocio de prueba que quedaria visible sin querer ("prueba1").
--   2) 29 negocios reales que nunca llegaron a "configurado=true".
--
-- PASO 1 — revisar antes de tocar nada. Corre esto primero y confirma que
-- la lista de "a activar" son negocios reales y no hay ningun nombre raro.
select id, nombre, telefono, especialidad, fecha_registro
from negocios
where configurado = false
  and nombre <> 'Pendiente de completar'
  and telefono <> '00000000'
  and nombre <> 'Tienda F4 Diamante ZZ'
  and nombre <> 'Negocio de Prueba'
  and nombre <> 'Super Admin Rservas'
  and nombre <> 'new'
  and telefono not in ('53331111','53332222','53333333','53334444','53335555')
order by nombre asc;
-- Deberia devolver 29 filas.

-- PASO 2 — activar esos 29 negocios reales.
update negocios
set configurado = true
where configurado = false
  and nombre <> 'Pendiente de completar'
  and telefono <> '00000000'
  and nombre <> 'Tienda F4 Diamante ZZ'
  and nombre <> 'Negocio de Prueba'
  and nombre <> 'Super Admin Rservas'
  and nombre <> 'new'
  and telefono not in ('53331111','53332222','53333333','53334444','53335555');

-- PASO 3 — opcional. "prueba1" (telefono 54066204) ya tiene configurado=true
-- de antes, asi que el PASO 2 no lo toca, pero con el cambio de codigo
-- quedaria visible en el directorio publico por ser un negocio de prueba.
-- Corre esto si quieres ocultarlo:
update negocios
set configurado = false
where nombre = 'prueba1' and telefono = '54066204';

-- Lo que NO se toca a proposito (se queda oculto, configurado=false):
--   - 13 registros "Pendiente de completar" (telefono 00000000): registros
--     abandonados a mitad de un flujo de registro, nunca fueron negocios reales.
--   - "Tienda F4 Diamante ZZ": la tienda de prueba de la sesion de F4,
--     pendiente de ocultar desde el SuperAdmin.
--   - "Negocio de Prueba", "Super Admin Rservas", "new": cuentas de prueba/admin.
--   - Estetica Roma, Salon Belleza Divina, Nails & Beauty, Pestanas Divinas,
--     Centro de Estilo: datos de siembra con telefonos secuenciales falsos
--     (53331111, 53332222, 53333333, 53334444, 53335555).
--
-- Para "ir cancelando manualmente" como pediste: el interruptor es el mismo
-- campo "configurado". Para ocultar cualquier negocio de RomaHub sin borrarlo:
--   update negocios set configurado = false where id = '<id-del-negocio>';
-- Y para volver a mostrarlo, lo mismo pero con true.
