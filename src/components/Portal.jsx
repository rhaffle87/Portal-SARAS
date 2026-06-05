import React from 'react';
import './Portal.css';

function Portal() {
  const toggleSidebar = () => {
    document.querySelector('.sidebar').classList.toggle('collapsed');
    document.querySelector('.content').classList.toggle('collapsed');
  };

  return (
    <div className="portal-body">
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="toggle-btn" onClick={toggleSidebar}>☰</button>
          <h2 className="sidebar-title">Portal S4RAS</h2>
        </div>
        <a href="#">🏠 <span>Beranda</span></a>
        <a href="#">👤 <span>Akun</span></a>
        <a href="#">📢 <span>Pengumuman</span></a>
        <a href="logout.html" className="logout-btn">⏻ Logout</a>
      </div>

      <div className="content">
        <div className="apps-section">
          <h2>Aplikasi dan Layanan</h2>
          <div className="apps-container">
            <a href="classroom.html" className="app-card">
              <img src="classroom.png" alt="Classroom" />
              <p>Classroom<br /><small>Materi & Pembelajaran Online</small></p>
            </a>
            <a href="nexaplay.html" className="app-card">
              <img src="presensi.png" alt="NexaPlay" />
              <p>NexaPlay<br /><small>Video Streaming</small></p>
            </a>
            <a href="onecloud.html" className="app-card">
              <img src="thesis.png" alt="OneCloud" />
              <p>OneCloud<br /><small>Email & Storage</small></p>
            </a>
            <a href="chat.html" className="app-card">
              <img src="academic.png" alt="Chat" />
              <p>Chat<br /><small>VoIP Service</small></p>
            </a>
          </div>
        </div>

        <div className="announcement-section">
          <div className="announcement">
            <h3>Pengumuman</h3>
            <a href="welcome-page.html" className="announcement-item">
              <img src="announcement.png" alt="icon" />
              <p>Selamat datang di Portal S4RAS</p>
            </a>
            <a href="beasiswa-vdmi-kse.html" className="announcement-item">
              <img src="announcement.png" alt="icon" />
              <p>Beasiswa VDMI dan KSE</p>
            </a>
            <a href="lpda.html" className="announcement-item">
              <img src="announcement.png" alt="icon" />
              <p>Lembaga Pengelola Dana Abadi (LPDA)</p>
            </a>
            <a href="#" className="btn">Lihat Semua Pengumuman</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portal;
