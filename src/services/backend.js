const BACKEND_API_BASE = process.env.REACT_APP_BACKEND_API_URL || '';

export const fetchAnnouncements = async () => {
  if (!BACKEND_API_BASE) {
    return [
      {
        title: 'Selamat datang di Portal S4RAS',
        description: 'Semua subsistem sudah terintegrasi dengan domain baru.',
        badge: 'Info'
      },
      {
        title: 'Keycloak SSO aktif',
        description: 'Login tunggal sudah berjalan di https://sso.s4ras.site',
        badge: 'Keamanan'
      },
      {
        title: 'Aplikasi terhubung',
        description: 'Portal, Moodle, Nextcloud, dan Monitoring bisa diakses melalui reverse proxy.',
        badge: 'Sistem'
      }
    ];
  }

  try {
    const res = await fetch(`${BACKEND_API_BASE}/announcements`);
    if (!res.ok) {
      throw new Error(`Service returned ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Announcement fetch failed:', error);
    return [
      {
        title: 'Pengumuman tidak tersedia',
        description: 'Tidak dapat memuat pengumuman dari backend. Mohon periksa koneksi API.',
        badge: 'Error'
      }
    ];
  }
};

const getTimeoutSignal = (ms) => {
  if (typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
};

// When no external backend API is configured, use the built-in health API
// served by portal-server.js on the same origin (no CORS, no no-cors hacks).

export const checkServiceHealth = async (service) => {
  const startTime = performance.now();

  try {
    const endpoint = BACKEND_API_BASE
      ? `${BACKEND_API_BASE}/health/${service.key}`   // external backend
      : `/api/health/${service.key}`;                  // built-in same-origin

    const res = await fetch(endpoint, {
      cache: 'no-store',
      signal: getTimeoutSignal(8000), // server-side probes need a bit more time
    });

    const latency = Math.round(performance.now() - startTime);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      const statusStr = (data?.status || '').toLowerCase();

      if (statusStr === 'online' || statusStr === 'ok' || statusStr === 'up') {
        return {
          key: service.key,
          status: 'online',
          label: data?.status || 'Online',
          details: data?.message || service.url,
          latency: data?.latency ?? latency,
        };
      }
    }

    // Health API responded but service is not online
    return {
      key: service.key,
      status: 'offline',
      label: 'Offline',
      details: `Health check returned non-online status`,
      latency: null,
    };
  } catch (error) {
    // Health API itself is unreachable (network error / timeout)
    return {
      key: service.key,
      status: 'offline',
      label: 'Offline',
      details: error.message || 'Health API unreachable',
      latency: null,
    };
  }
};
