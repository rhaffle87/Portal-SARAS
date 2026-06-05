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
        description: 'Portal, Moodle, Nextcloud, dan Grafana bisa diakses melalui reverse proxy.',
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

export const checkServiceHealth = async (service) => {
  if (BACKEND_API_BASE) {
    try {
      const res = await fetch(`${BACKEND_API_BASE}/health/${service.key}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        return {
          key: service.key,
          status: 'offline',
          label: `Offline (${res.status})`,
          details: service.url,
        };
      }
      const data = await res.json().catch(() => null);
      return {
        key: service.key,
        status: 'online',
        label: data?.status || 'Online',
        details: data?.message || service.url,
      };
    } catch (error) {
      return {
        key: service.key,
        status: 'offline',
        label: 'Offline',
        details: error.message || service.url,
      };
    }
  }

  try {
    await fetch(service.url, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
    });
    return {
      key: service.key,
      status: 'online',
      label: 'Online',
      details: service.url,
    };
  } catch (error) {
    return {
      key: service.key,
      status: 'offline',
      label: 'Offline',
      details: error.message,
    };
  }
};
