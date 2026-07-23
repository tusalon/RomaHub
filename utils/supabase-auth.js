const RomaAuth = (() => {
  const STORAGE_KEY = 'rservasroma_business_session';
  const AUTH_PHONE_DOMAIN = 'whatsapp.rservasroma.local';

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

  const getSession = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (!session?.access_token || Number(session.expires_at || 0) < Date.now() + 30000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return session;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  };

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

  const request = async (path, options = {}, settings = {}) => {
    const config = getConfig();
    const session = getSession();
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
      'usuarios_negocio?activo=eq.true&select=negocio_id,rol,negocios(id,nombre,slug,logo_url,sitio_web)&limit=1',
      {},
      { requireAuth: true }
    );
    return Array.isArray(rows) ? rows[0] || null : null;
  };

  return {
    signIn,
    signInWithWhatsApp,
    signOut,
    getSession,
    request,
    getBusinessAccess,
    normalizeWhatsApp,
    phoneToAuthEmail
  };
})();

window.RomaAuth = RomaAuth;
