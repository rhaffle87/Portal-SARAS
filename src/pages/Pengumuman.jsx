// AnnouncementPage.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Pengumuman.css';
import { fetchAnnouncements } from '../services/backend';

function Pengumuman() {
  const [announcements, setAnnouncements] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    fetchAnnouncements()
      .then((data) => {
        if (active) {
          setAnnouncements(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="portal-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo"><span>S4RAS</span> Portal</h1>
        </div>
        <nav className="sidebar-menu">
          <NavLink to="/home" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            🏠 Beranda
          </NavLink>
          <NavLink to="/akun" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            👤 Akun
          </NavLink>
          <NavLink to="/pengumuman" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            📢 Pengumuman
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <div className="announcement-header">
          <h2>Pengumuman</h2>
          <div className="search-button">🔍</div>
        </div>

        {loading ? (
          <div className="announcement-loader">Memuat pengumuman...</div>
        ) : (
          <div className="announcement-grid">
            {announcements.map((item, index) => (
              <div className="announcement-card" key={index}>
                <div className="megaphone-icon">📢</div>
                <div className="announcement-title">{item.title}</div>
                <div className="announcement-description">{item.description || item.desc}</div>
                <div className="announcement-badge">{item.badge || item.badgeText || 'Info'}</div>
              </div>
            ))}
          </div>
        )}

        <div className="announcement-actions">
          <Link to="/home" className="action-button">Kembali ke Beranda</Link>
        </div>
      </main>
    </div>
  );
}

export default Pengumuman;