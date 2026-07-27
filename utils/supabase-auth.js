const RomaAuth = (() => {
  const STORAGE_KEY = 'rservasroma_business_session';
  const AUTH_PHONE_DOMAIN = 'whatsapp.rservasroma.local';
  let refreshPromise = null;

  const getConfig = () => {
    const url = String(window.SUPABASE_URL || '').replace(/\/$/, '');
    const key = window.SUPABASE_ANON_KEY || '';
    if (!url || !key) throw new Error('Supabase no configurado.');
    return { url, key };
  };

  const normalizeWhatsApp = (value) => {
    const digits = String(value || '').replace(/\D/g, '');
    const localDigits = digits.startsWith('53') && digits.length === 10 ? digits.slice(2) : digits;
    if (!/^\d{8}$/.test(localDigits)) {
      throw new Error('Escribe los 8 dígitos del WhatsApp cubano.');
    }
    return localDigits;
  };

  const phoneToAuthEmail = (value) => {
    const localDigits = normalizeWhatsApp(value);
    return `53${localDigits}@${AUTH_PHONE_DOMAIN}`;
  };

  const saveSession = (session) => {
    const expiresIn = Number(session.expires_in || 3600);
    const normalized = {
      access_token: session.access_token,
      refresh_token: session.refresh_token || '',
      expires_at: Date.now() + expiresIn * 1000,
      user: session.user || null
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  };

  const readStoredSession = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  };

  const getSession = () => {
    const session = readStoredSession();
    if (!session?.access_token || Number(session.expires_at || 0) < Date.now() + 30000) return null;
    return session;
  };

  const refreshSession = async () => {
    if (refreshPromise) return refreshPromise;
    refreshPromise = (async () => {
      const stored = readStoredSession();
      if (!stored?.refresh_token) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      const config = getConfig();
      const response = await fetch(`${config.url}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: {
          apikey: config.key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: stored.refresh_token })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.access_token) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return saveSession(data);
    })();
    try {
      return await refreshPromise;
    } finally {
      refreshPromise = null;
    }
  };

  const ensureSession = async () => getSession() || refreshSession();

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('negocioId');
  };

  const signIn = async (email, password) => {
    const config = getConfig();
    const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: config.key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error_description || data.msg || 'WhatsApp o contraseña incorrectos.');
    }
    return saveSession(data);
  };

  const signInWithWhatsApp = (whatsapp, password) => {
    return signIn(phoneToAuthEmail(whatsapp), password);
  };

  const recoverAccess = async ({ whatsapp, recoveryCode, newPassword, website = '' }) => {
    const config = getConfig();
    const response = await fetch(`${config.url}/functions/v1/recuperar-acceso`, {
      method: 'POST',
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        whatsapp: normalizeWhatsApp(whatsapp),
        codigo_recuperacion: recoveryCode,
        nueva_password: newPassword,
        website
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'No se pudo recuperar el acceso.');
    return data;
  };

  const request = async (path, options = {}, settings = {}) => {
    const config = getConfig();
    const session = await ensureSession();
    if (settings.requireAuth && !session) throw new Error('Inicia sesión para continuar.');

    const response = await fetch(`${config.url}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${session?.access_token || config.key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'No se pudo completar la operación.');
    }
    if (response.status === 204) return [];
    return response.json();
  };

  const getBusinessAccess = async () => {
    const rows = await request(
      'usuarios_negocio?activo=eq.true&select=negocio_id,rol,negocios(id,nombre,slug,telefono,especialidad,provincia,municipio,logo_url,imagen_fondo_url,imagen_fondo_pos_x,imagen_fondo_pos_y,mensaje_bienvenida,sitio_web,es_tienda_externa)&limit=1',
      {},
      { requireAuth: true }
    );
    return Array.isArray(rows) ? rows[0] || null : null;
  };

  return {
    signIn,
    signInWithWhatsApp,
    recoverAccess,
    signOut,
    getSession,
    ensureSession,
    request,
    getBusinessAccess,
    normalizeWhatsApp,
    phoneToAuthEmail
  };
})();

window.RomaAuth = RomaAuth;
