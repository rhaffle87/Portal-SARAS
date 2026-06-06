import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeLanguageContext = createContext();

export const useThemeLanguage = () => useContext(ThemeLanguageContext);

const translations = {
  id: {
    // Navigation
    'nav.home': 'Beranda',
    'nav.account': 'Akun',
    'nav.announcements': 'Pengumuman',
    'nav.settings': 'Pengaturan Web',
    'nav.admin': 'Admin',
    'nav.logout': 'Logout',
    
    // Beranda / Home
    'home.greeting.morning': 'Selamat pagi',
    'home.greeting.afternoon': 'Selamat siang',
    'home.greeting.evening': 'Selamat sore',
    'home.greeting.night': 'Selamat malam',
    'home.today': 'Hari ini adalah',
    'home.sso_login': 'Anda login menggunakan Single Sign-On (SSO) Portal S4RAS.',
    'home.apps_services': 'Aplikasi dan Layanan',
    'home.service_status': 'Status Layanan',
    'home.status.online': 'Online',
    'home.status.offline': 'Offline',
    'home.status.loading': 'Memuat...',
    'home.notice.text1': 'Butuh bantuan login atau integrasi SSO? Kunjungi halaman ',
    'home.notice.link': 'Pengaturan Web',
    'home.notice.text2': ' atau hubungi admin portal.',
    'home.ann.title': 'Pengumuman Terbaru',
    'home.ann.view_all': 'Lihat semua pengumuman',
    'home.ann.loading': 'Memuat pengumuman...',
    
    // Service descriptions (Indonesian)
    'service.desc.moodle': 'Platform pembelajaran daring untuk materi dan tugas.',
    'service.desc.sso': 'Otentikasi terpusat untuk seluruh layanan S4RAS.',
    'service.desc.cloud': 'Penyimpanan awan untuk dokumen dan file penting.',
    'service.desc.iptv': 'Layanan IPTV untuk siaran dan konten video.',
    'service.desc.voip': 'Layanan telepon berbasis IP untuk civitas.',
    'service.desc.monitor': 'Dashboard monitoring untuk infrastruktur S4RAS.',

    // Akun / Account
    'account.title': 'Profil Pengguna',
    'account.title_info': 'Informasi Akun',
    'account.back': 'Kembali ke Beranda',
    'account.role': 'Peran',
    'account.username': 'Nama Pengguna',
    'account.email': 'Email',
    'account.firstname': 'Nama Depan',
    'account.lastname': 'Nama Belakang',
    'account.manage_btn': 'Kelola Profil Akun',
    'account.personal_info': 'Informasi Pribadi',
    'account.personal_desc': 'Data diri Anda yang terintegrasi pada sistem SSO S4RAS',
    'account.contact_info': 'Hubungan Kontak',
    'account.contact_desc': 'Alamat email aktif untuk notifikasi sistem',
    'account.fullname': 'Nama Lengkap',
    'account.user_portal': 'Pengguna Portal',
    'account.fullname_sub': 'Nama lengkap terdaftar',
    'account.username_sub': 'ID unik pengguna',
    'account.email_sub': 'Email aktif untuk autentikasi',
    
    // Pengumuman / Announcements
    'ann.title': 'Daftar Pengumuman',
    'ann.back': 'Kembali ke Beranda',
    'ann.search_placeholder': 'Cari pengumuman...',
    'ann.no_results': 'Tidak ada pengumuman yang cocok dengan pencarian Anda.',
    'ann.loading': 'Memuat pengumuman...',
    
    // Pengaturan / Settings
    'set.title': 'Pengaturan Web',
    'set.theme_title': 'Mode Tampilan',
    'set.theme_desc': 'Pilih mode tampilan yang nyaman untuk Anda',
    'set.theme.dark': 'Mode Gelap',
    'set.theme.light': 'Mode Terang',
    'set.lang_title': 'Bahasa',
    'set.lang_desc': 'Pilih bahasa yang Anda gunakan',
    'set.lang.id': 'Bahasa Indonesia',
    'set.lang.en': 'English',
    
    // Admin
    'admin.title': 'Administrasi Sistem',
    'admin.api_config': 'Konfigurasi API',
    'admin.api_url': 'Backend API URL',
    'admin.not_configured': 'Belum dikonfigurasi',
    'admin.deploy_control': 'Deploy Control',
    'admin.deploy_desc': 'Memicu build otomatis dan melakukan restart service PM2 pada server produksi.',
    'admin.deploy_btn': 'Trigger Deploy',
    'admin.deploying': 'Deploying...',
    'admin.deploy_success': 'Deploy Berhasil',
    'admin.deploy_failed': 'Deploy Gagal'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.account': 'Account',
    'nav.announcements': 'Announcements',
    'nav.settings': 'Web Settings',
    'nav.admin': 'Admin',
    'nav.logout': 'Logout',
    
    // Beranda / Home
    'home.greeting.morning': 'Good morning',
    'home.greeting.afternoon': 'Good afternoon',
    'home.greeting.evening': 'Good evening',
    'home.greeting.night': 'Good night',
    'home.today': 'Today is',
    'home.sso_login': 'You are logged in using Portal S4RAS Single Sign-On (SSO).',
    'home.apps_services': 'Applications and Services',
    'home.service_status': 'Service Status',
    'home.status.online': 'Online',
    'home.status.offline': 'Offline',
    'home.status.loading': 'Loading...',
    'home.notice.text1': 'Need help logging in or with SSO integration? Visit the ',
    'home.notice.link': 'Web Settings',
    'home.notice.text2': ' page or contact the portal admin.',
    'home.ann.title': 'Recent Announcements',
    'home.ann.view_all': 'View all announcements',
    'home.ann.loading': 'Loading announcements...',
    
    // Service descriptions (English)
    'service.desc.moodle': 'Online learning platform for course materials and assignments.',
    'service.desc.sso': 'Centralized authentication for all S4RAS services.',
    'service.desc.cloud': 'Cloud storage for documents and important files.',
    'service.desc.iptv': 'IPTV service for broadcasting and video content.',
    'service.desc.voip': 'IP-based telephone service for the campus community.',
    'service.desc.monitor': 'Monitoring dashboard for S4RAS infrastructure.',

    // Akun / Account
    'account.title': 'User Profile',
    'account.title_info': 'Account Information',
    'account.back': 'Back to Home',
    'account.role': 'Role',
    'account.username': 'Username',
    'account.email': 'Email',
    'account.firstname': 'First Name',
    'account.lastname': 'Last Name',
    'account.manage_btn': 'Manage Account Profile',
    'account.personal_info': 'Personal Information',
    'account.personal_desc': 'Your personal data integrated with SSO S4RAS system',
    'account.contact_info': 'Contact Connections',
    'account.contact_desc': 'Active email address for system notifications',
    'account.fullname': 'Full Name',
    'account.user_portal': 'Portal User',
    'account.fullname_sub': 'Registered full name',
    'account.username_sub': 'Unique user ID',
    'account.email_sub': 'Active email for authentication',
    
    // Pengumuman / Announcements
    'ann.title': 'Announcements List',
    'ann.back': 'Back to Home',
    'ann.search_placeholder': 'Search announcements...',
    'ann.no_results': 'No announcements match your search.',
    'ann.loading': 'Loading announcements...',
    
    // Pengaturan / Settings
    'set.title': 'Web Settings',
    'set.theme_title': 'Appearance Mode',
    'set.theme_desc': 'Choose an appearance mode comfortable for you',
    'set.theme.dark': 'Dark Mode',
    'set.theme.light': 'Light Mode',
    'set.lang_title': 'Language',
    'set.lang_desc': 'Choose the language you use',
    'set.lang.id': 'Bahasa Indonesia',
    'set.lang.en': 'English',
    
    // Admin
    'admin.title': 'System Administration',
    'admin.api_config': 'API Configuration',
    'admin.api_url': 'Backend API URL',
    'admin.not_configured': 'Not configured',
    'admin.deploy_control': 'Deploy Control',
    'admin.deploy_desc': 'Trigger automatic build and restart PM2 service on production server.',
    'admin.deploy_btn': 'Trigger Deploy',
    'admin.deploying': 'Deploying...',
    'admin.deploy_success': 'Deploy Success',
    'admin.deploy_failed': 'Deploy Failed'
  }
};

export const ThemeLanguageProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('saras-theme') || 'dark');
  const [language, setLanguage] = useState(() => localStorage.getItem('saras-lang') || 'id');

  useEffect(() => {
    localStorage.setItem('saras-theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('saras-lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['id']?.[key] || key;
  };

  return (
    <ThemeLanguageContext.Provider value={{ theme, setTheme, language, setLanguage, t }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};
