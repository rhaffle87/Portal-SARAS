// HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Beranda.css';
import services from '../config/services';
import { fetchAnnouncements, checkServiceHealth } from '../services/backend';
import { useKeycloak } from '../context/KeycloakContext';

function Beranda() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [healthStatuses, setHealthStatuses] = useState([]);
  const [healthLoading, setHealthLoading] = useState(true);
  const { profile } = useKeycloak();
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('id-ID', options);
  const weekday = today.toLocaleDateString('id-ID', { weekday: 'long' });

  useEffect(() => {
    let mounted = true;
    fetchAnnouncements().then((data) => {
      if (mounted) {
        setAnnouncements(data);
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) {
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadHealth = async () => {
      const results = await Promise.all(services.map(checkServiceHealth));
      if (mounted) {
        setHealthStatuses(results);
        setHealthLoading(false);
      }
    };
    loadHealth();
    return () => {
      mounted = false;
    };
  }, []);

  const username = profile?.username || profile?.email || 'Pengguna S4RAS';

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

      <main className="main-content home-layout">
        <div className="left-column">
          <div className="apps-section">
            <h2>Aplikasi dan Layanan</h2>
            <div className="apps-grid">
              {services.map((service) => (
                <a key={service.key} href={service.url} target="_blank" rel="noreferrer" className="app-card clickable">
                  <div className="app-icon">{service.icon}</div>
                  <div>
                    <div className="app-name">{service.title}</div>
                    <div className="app-desc">{service.description}</div>
                  </div>
                </a>
              ))}
            </div>
            <Link to="/pengumuman" className="show-all-btn">⬇️ Lihat Pengumuman</Link>
          </div>
        </div>

        <div className="right-column">
          <div className="profile-card">
            <div className="profile-icon-large">👤</div>
            <div className="profile-info">
              <div className="profile-name">{username}</div>
              <div className="profile-email">{profile?.email || 'email@domain.com'}</div>
              <Link to="/akun" className="manage-account">Kelola Akun ➔</Link>
            </div>
          </div>

          <div className="date-card">
            <div className="day">{weekday}</div>
            <div className="full-date">{formattedDate}</div>
          </div>

          <div className="health-card">
            <h3>Service Health</h3>
            {healthLoading ? (
              <div className="announcement-loader">Memeriksa layanan...</div>
            ) : (
              healthStatuses.map((status) => {
                const service = services.find((item) => item.key === status.key);
                return (
                  <div className="health-status-row" key={status.key}>
                    <div>
                      <div className="health-name">{service?.title || status.key}</div>
                      <div className="health-detail">{status.details}</div>
                    </div>
                    <div className={`health-indicator ${status.status === 'online' ? 'status-online' : 'status-offline'}`}>
                      {status.label}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="announcements-card">
            <h3>Pengumuman</h3>
            {loading ? (
              <div className="announcement-loader">Memuat pengumuman...</div>
            ) : (
              announcements.map((item, index) => (
                <div className="announcement-mini" key={index}>
                  <div className="megaphone-mini">📢</div>
                  <div>
                    <div className="announcement-title-mini">{item.title}</div>
                    <div className="announcement-desc-mini">{item.description || item.desc}</div>
                  </div>
                </div>
              ))
            )}
            <Link to="/pengumuman" className="view-all-announcements">Lihat Semua Pengumuman</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Beranda;
