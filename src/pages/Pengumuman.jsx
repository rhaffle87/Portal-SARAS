// AnnouncementPage.jsx
import React from 'react';
import './Pengumuman.css';

const announcements = [
  { title: 'Lembaga Pengelola Dana Abadi', description: 'Lembaga Pengelola Dana Abadi (LPDA)', badge: 'Lainnya' },
  { title: 'Peluang Hibah Nasional & Internasional', description: 'Peluang Hibah Nasional & Internasional', badge: 'Kegiatan' },
  { title: 'Peringatan waspada penipuan...', description: 'Peringatan waspada penipuan atas nama pejabat ITS', badge: 'Sosialisasi' },
  { title: 'Beasiswa Boeing', description: 'Beasiswa Boeing', badge: 'Kegiatan' },
  { title: 'panduan UTBK', description: 'Panduan Lengkap UTBK-SNBT 2025 di ITS', badge: 'Sosialisasi' },
  { title: 'Ibadah Perayaan Paskah Civitas', description: 'Ibadah Perayaan Paskah Civitas Akademika Kristen ITS 2025', badge: 'Kegiatan' },
  { title: 'Beasiswa ADARO', description: 'Beasiswa ADARO', badge: 'Kegiatan' },
  { title: 'Women in Technopreneurship', description: 'Program pendanaan produk inovasi menuju pasar', badge: 'Kegiatan' },
  { title: 'ISICO 2025', description: 'CALL FOR PAPERS AI Powered Business Transformation', badge: 'Kegiatan' },
];

function Pengumuman() {
  return (
    <div className="portal-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo"><span>S4RAS</span> Portal</h1>
        </div>
        <nav className="sidebar-menu">
          <a href="#" className="menu-item">🏠 Beranda</a>
          <a href="#" className="menu-item">👤 Akun</a>
          <a href="#" className="menu-item active">📢 Pengumuman</a>
        </nav>
      </aside>

      <main className="main-content">
        <div className="announcement-header">
          <h2>Pengumuman</h2>
          <div className="search-button">🔍</div>
        </div>

        <div className="announcement-grid">
          {announcements.map((item, index) => (
            <div className="announcement-card" key={index}>
              <div className="megaphone-icon">📢</div>
              <div className="announcement-title">{item.title}</div>
              <div className="announcement-description">{item.description}</div>
              <div className="announcement-badge">{item.badge}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Pengumuman;