-- RomaHub - Fase 8: seguimiento privado de pedidos para compradoras sin cuenta.

alter table public.pedidos_whatsapp
  add column if not exists tracking_token uuid not null default gen_random_uuid();

create unique index if not exists pedidos_whatsapp_tracking_token_idx
  on public.pedidos_whatsapp (tracking_token);

-- Los pedidos se crean mediante una funcion controlada. La tabla no queda
-- abierta para escrituras directas desde el navegador.
revoke insert on table public.pedidos_whatsapp from anon, authenticated;

create or replace function public.crear_pedido_romahub(
  p_negocio_id uuid,
  p_cliente_nombre text,
  p_cliente_whatsapp text,
  p_items jsonb,
  p_total numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_nombre text := trim(coalesce(p_cliente_nombre, ''));
  v_whatsapp text := regexp_replace(coalesce(p_cliente_whatsapp, ''), '[^0-9]', '', 'g');
  v_items jsonb;
  v_pedido public.pedidos_whatsapp%rowtype;
begin
  if not exists (
    select 1
    from public.negocios n
    where n.id = p_negocio_id
      and n.configurado = true
  ) then
    raise exception 'Este negocio no esta disponible.' using errcode = '22023';
  end if;

  if char_length(v_nombre) < 2 or char_length(v_nombre) > 120 then
    raise exception 'Escribe un nombre valido.' using errcode = '22023';
  end if;

  if v_whatsapp !~ '^[0-9]{8,15}$' then
    raise exception 'Escribe un WhatsApp valido.' using errcode = '22023';
  end if;

  if jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) < 1
    or jsonb_array_length(p_items) > 50
    or pg_column_size(p_items) > 50000 then
    raise exception 'El pedido no contiene articulos validos.' using errcode = '22023';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', left(trim(coalesce(item->>'id', '')), 180),
    'tipo', case when lower(item->>'tipo') = 'curso' then 'curso' else 'producto' end,
    'nombre', left(trim(coalesce(item->>'nombre', 'Articulo')), 180),
    'precio', case
      when coalesce(item->>'precio', '') ~ '^[0-9]+([.][0-9]+)?$'
        then least((item->>'precio')::numeric, 1000000000)
      else 0
    end,
    'moneda', case
      when upper(coalesce(item->>'moneda', 'CUP')) in ('CUP', 'USD', 'EUR', 'MLC')
        then upper(item->>'moneda')
      else 'CUP'
    end,
    'cantidad', case
      when coalesce(item->>'cantidad', '') ~ '^[0-9]+$'
        then greatest(1, least((item->>'cantidad')::integer, 99))
      else 1
    end,
    'subtotal', case
      when coalesce(item->>'subtotal', '') ~ '^[0-9]+([.][0-9]+)?$'
        then least((item->>'subtotal')::numeric, 1000000000)
      else 0
    end
  )), '[]'::jsonb)
  into v_items
  from jsonb_array_elements(p_items) item
  where nullif(trim(coalesce(item->>'nombre', '')), '') is not null;

  if jsonb_array_length(v_items) < 1 then
    raise exception 'El pedido no contiene articulos validos.' using errcode = '22023';
  end if;

  insert into public.pedidos_whatsapp (
    negocio_id,
    cliente_nombre,
    cliente_whatsapp,
    items,
    total,
    estado
  ) values (
    p_negocio_id,
    left(v_nombre, 120),
    v_whatsapp,
    v_items,
    greatest(0, least(coalesce(p_total, 0), 1000000000)),
    'nuevo'
  )
  returning * into v_pedido;

  return jsonb_build_object(
    'id', v_pedido.id,
    'tracking_token', v_pedido.tracking_token,
    'estado', v_pedido.estado,
    'created_at', v_pedido.created_at,
    'updated_at', v_pedido.updated_at
  );
end;
$$;

create or replace function public.consultar_mis_pedidos_romahub(
  p_tokens uuid[]
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_tokens uuid[] := coalesce(p_tokens, array[]::uuid[]);
  v_resultado jsonb;
begin
  if cardinality(v_tokens) > 20 then
    raise exception 'Solo puedes consultar 20 pedidos a la vez.' using errcode = '22023';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id,
    'negocio_id', p.negocio_id,
    'negocio_nombre', coalesce(n.nombre, 'Negocio de RomaHub'),
    'negocio_logo', coalesce(n.logo_url, ''),
    'negocio_whatsapp', coalesce(n.telefono, ''),
    'items', p.items,
    'total', p.total,
    'estado', p.estado,
    'created_at', p.created_at,
    'updated_at', p.updated_at
  ) order by p.created_at desc), '[]'::jsonb)
  into v_resultado
  from public.pedidos_whatsapp p
  left join public.negocios n on n.id = p.negocio_id
  where p.tracking_token = any(v_tokens);

  return v_resultado;
end;
$$;

revoke all on function public.crear_pedido_romahub(uuid, text, text, jsonb, numeric) from public;
revoke all on function public.consultar_mis_pedidos_romahub(uuid[]) from public;
grant execute on function public.crear_pedido_romahub(uuid, text, text, jsonb, numeric) to anon, authenticated;
grant execute on function public.consultar_mis_pedidos_romahub(uuid[]) to anon, authenticated;

comment on function public.crear_pedido_romahub(uuid, text, text, jsonb, numeric) is
  'Crea un pedido validado y devuelve un token privado de seguimiento.';
comment on function public.consultar_mis_pedidos_romahub(uuid[]) is
  'Devuelve datos no personales de pedidos identificados por tokens privados.';

notify pgrst, 'reload schema';
