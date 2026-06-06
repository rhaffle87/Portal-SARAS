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

export const checkServiceHealth = async (service) => {
  // 1. Try backend API health check first if base URL is set
  if (BACKEND_API_BASE) {
    try {
      const res = await fetch(`${BACKEND_API_BASE}/health/${service.key}`, {
        cache: 'no-store',
        signal: getTimeoutSignal(5000),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        const statusStr = (data?.status || '').toLowerCase();
        if (statusStr === 'online' || statusStr === 'ok' || statusStr === 'up') {
          return {
            key: service.key,
            status: 'online',
            label: data?.status || 'Online',
            details: data?.message || service.url,
          };
        }
      }
      
      // If the backend responded but it wasn't ok/online, trust the backend response and mark it offline.
      // Do not fall back to browser checks.
      return {
        key: service.key,
        status: 'offline',
        label: 'Offline',
        details: `Backend returned status ${res.status}`,
      };
    } catch (error) {
      console.warn(`Backend health check failed for ${service.key}, falling back to browser check.`, error);
    }
  }

  // 2. Client-side browser fallback check (direct fetch)
  // Prevent false-positives for proxy 502/503 responses:
  // If the backend base URL was defined but the fetch failed (backend down), or if this is not the SSO service,
  // we default to offline as client-side check with 'no-cors' resolves on proxy error pages.
  if (service.key !== 'sso' && BACKEND_API_BASE) {
    return {
      key: service.key,
      status: 'offline',
      label: 'Offline',
      details: 'Backend health check unreachable',
    };
  }

  try {
    // Try GET with mode: 'no-cors' since some web servers/gateways reject HEAD requests
    await fetch(service.url, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: getTimeoutSignal(5000),
    });
    return {
      key: service.key,
      status: 'online',
      label: 'Online',
      details: service.url,
    };
  } catch (publicError) {
    // 3. Special Local Fallback: If running on HTTP (e.g., localhost), try the internal URL directly
    if (window.location.protocol === 'http:' && service.internalUrl) {
      try {
        await fetch(service.internalUrl, {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-store',
          signal: getTimeoutSignal(3000),
        });
        return {
          key: service.key,
          status: 'online',
          label: 'Online (Lokal)',
          details: service.internalUrl,
        };
      } catch (internalError) {
        // Fall through
      }
    }

    return {
      key: service.key,
      status: 'offline',
      label: 'Offline',
      details: publicError.message || 'Koneksi gagal',
    };
  }
};
