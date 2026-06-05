// HomePage.jsx
import React from 'react';
import './Beranda.css';

const apps = [
  { name: 'Classroom', desc: 'Materi dan tugas', icon: '🎓' },
  { name: 'OneCloud', desc: 'Email', icon: '📧' },
  { name: 'NexaPlay', desc: 'Streaming Service', icon: '👥' },
  { name: 'Chat', desc: 'A VoIP Service', icon: '🗯️' },
  { name: 'Settings', desc: 'Pengaturan', icon: '⚙️' },
];

const announcements = [
  { title: 'Ijazah Palsu Jokowi Terungkap', desc: 'Peringatan' },
  { title: 'Fufufafa  IPK 2.3', desc: 'Waspada Indonesia Cemas 2050' },
  { title: 'Peringatan waspada penipuan atas nama pejabat ITS', desc: 'Peringatan waspada penipuan' },
];

function Beranda() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('id-ID', options);

  return (
    <div className="portal-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo"><span>S4RAS</span> Portal</h1>
        </div>
        <nav className="sidebar-menu">
          <a href="#" className="menu-item active">🏠 Beranda</a>
          <a href="#" className="menu-item">👤 Akun</a>
          <a href="#" className="menu-item">📢 Pengumuman</a>
        </nav>
      </aside>

      <main className="main-content home-layout">
        <div className="left-column">
          <div className="apps-section">
            <h2>Aplikasi dan Layanan</h2>
            <div className="apps-grid">
              {apps.map((app, index) => (
                <div className="app-card" key={index}>
                  <div className="app-icon">{app.icon}</div>
                  <div>
                    <div className="app-name">{app.name}</div>
                    <div className="app-desc">{app.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="show-all-btn">⬇️ Tampilkan Semua Aplikasi</button>
          </div>
        </div>

        <div className="right-column">
          <div className="profile-card">
            <div className="profile-icon-large">👨‍🎓</div>
            <div className="profile-info">
              <div className="profile-name">Muhamad Rafi Rabbani</div>
              <div className="profile-email">rafi.rabbani@saras.com</div>
              <div className="manage-account">Kelola Akun ➔</div>
            </div>
          </div>

          <div className="date-card">
            <div className="day">{today.toLocaleDateString('id-ID', { weekday: 'long' })}</div>
            <div className="full-date">{today.getDate()} {today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</div>
          </div>

          <div className="announcements-card">
            <h3>Pengumuman</h3>
            {announcements.map((item, index) => (
              <div className="announcement-mini" key={index}>
                <div className="megaphone-mini">📢</div>
                <div>
                  <div className="announcement-title-mini">{item.title}</div>
                  <div className="announcement-desc-mini">{item.desc}</div>
                </div>
              </div>
            ))}
            <button className="view-all-announcements">Lihat Semua Pengumuman</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Beranda;
