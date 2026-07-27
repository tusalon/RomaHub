-- RomaHub - Fase 5: favoritos agregados, sin identificar a la clienta.

alter table public.romahub_eventos
  drop constraint if exists romahub_eventos_evento_check;

alter table public.romahub_eventos
  add constraint romahub_eventos_evento_check check (evento in (
    'perfil_vista',
    'producto_visto',
    'whatsapp_click',
    'reserva_click',
    'compartir',
    'favorito'
  ));

create or replace function public.mis_estadisticas_romahub(
  p_negocio_id uuid,
  p_dias integer default 30
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_periodo integer := greatest(7, least(90, coalesce(p_dias, 30)));
  v_desde timestamptz;
  v_visitas bigint := 0;
  v_whatsapp bigint := 0;
  v_reservas bigint := 0;
  v_productos bigint := 0;
  v_compartidos bigint := 0;
  v_favoritos bigint := 0;
  v_dias_json jsonb := '[]'::jsonb;
  v_top_json jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'Inicia sesion para continuar.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.usuarios_negocio u
    where u.user_id = auth.uid()
      and u.negocio_id = p_negocio_id
      and u.activo = true
      and u.rol in ('dueno', 'admin')
  ) then
    raise exception 'No tienes permiso para ver estas estadisticas.' using errcode = '42501';
  end if;

  v_desde := now() - make_interval(days => v_periodo);

  select
    count(*) filter (where evento = 'perfil_vista'),
    count(*) filter (where evento = 'whatsapp_click'),
    count(*) filter (where evento = 'reserva_click'),
    count(*) filter (where evento = 'producto_visto'),
    count(*) filter (where evento = 'compartir'),
    count(*) filter (where evento = 'favorito')
  into v_visitas, v_whatsapp, v_reservas, v_productos, v_compartidos, v_favoritos
  from public.romahub_eventos
  where negocio_id = p_negocio_id
    and created_at >= v_desde;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'fecha', to_char(dia, 'YYYY-MM-DD'),
        'visitas', visitas,
        'contactos', contactos
      )
      order by dia
    ),
    '[]'::jsonb
  )
  into v_dias_json
  from (
    select
      serie.dia::date as dia,
      count(e.id) filter (where e.evento = 'perfil_vista') as visitas,
      count(e.id) filter (where e.evento in ('whatsapp_click', 'reserva_click')) as contactos
    from generate_series(current_date - 6, current_date, interval '1 day') as serie(dia)
    left join public.romahub_eventos e
      on e.negocio_id = p_negocio_id
      and e.created_at >= serie.dia
      and e.created_at < serie.dia + interval '1 day'
    group by serie.dia
  ) resumen_diario;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'nombre', nombre,
        'tipo', tipo,
        'vistas', vistas
      )
      order by vistas desc, nombre asc
    ),
    '[]'::jsonb
  )
  into v_top_json
  from (
    select
      coalesce(nullif(item_nombre, ''), 'Elemento del catálogo') as nombre,
      coalesce(item_tipo, 'producto') as tipo,
      count(*) as vistas
    from public.romahub_eventos
    where negocio_id = p_negocio_id
      and evento = 'producto_visto'
      and created_at >= v_desde
    group by coalesce(nullif(item_nombre, ''), 'Elemento del catálogo'), coalesce(item_tipo, 'producto')
    order by count(*) desc
    limit 5
  ) top_items;

  return jsonb_build_object(
    'periodo_dias', v_periodo,
    'visitas', v_visitas,
    'whatsapp', v_whatsapp,
    'reservas', v_reservas,
    'contactos', v_whatsapp + v_reservas,
    'productos_vistos', v_productos,
    'compartidos', v_compartidos,
    'favoritos', v_favoritos,
    'conversion_pct', case
      when v_visitas > 0 then round(((v_whatsapp + v_reservas)::numeric * 100) / v_visitas, 1)
      else 0
    end,
    'dias', v_dias_json,
    'top_items', v_top_json
  );
end;
$$;

revoke all on function public.mis_estadisticas_romahub(uuid, integer) from public;
grant execute on function public.mis_estadisticas_romahub(uuid, integer) to authenticated;

notify pgrst, 'reload schema';
