const services = [
  // Portal entry removed: portal is the current application and should not link to itself
  {
    key: 'moodle',
    title: 'Moodle LMS',
    description: 'Platform pembelajaran daring untuk materi dan tugas.',
    icon: '🎓',
    url: 'https://moodle.s4ras.site',
    internalUrl: 'http://192.168.10.203'
  },
  {
    key: 'sso',
    title: 'SSO Keycloak',
    description: 'Otentikasi terpusat untuk seluruh layanan S4RAS.',
    icon: '🔐',
    url: 'https://sso.s4ras.site',
    internalUrl: 'http://192.168.10.206:8080'
  },
  {
    key: 'cloud',
    title: 'Nextcloud SAN',
    description: 'Penyimpanan awan untuk dokumen dan file penting.',
    icon: '☁️',
    url: 'https://cloud.s4ras.site',
    internalUrl: 'http://192.168.10.207'
  },
  {
    key: 'iptv',
    title: 'Nexaplay IPTV',
    description: 'Layanan IPTV untuk siaran dan konten video.',
    icon: '📺',
    url: 'https://iptv.s4ras.site',
    internalUrl: 'http://192.168.10.200'
  },
  {
    key: 'voip',
    title: 'VoIP Server',
    description: 'Layanan telepon berbasis IP untuk civitas.',
    icon: '📞',
    url: 'https://voip.s4ras.site',
    internalUrl: 'http://192.168.10.201:8080'
  },
  {
    key: 'monitor',
    title: 'Monitoring',
    description: 'Dashboard monitoring untuk infrastruktur S4RAS.',
    icon: '📊',
    url: 'https://monitor.s4ras.site',
    internalUrl: 'http://192.168.10.204:3000'
  },
  // Prometheus removed: monitoring.s4ras.site will be managed separately on VM 192.168.10.204
];

export default services;
