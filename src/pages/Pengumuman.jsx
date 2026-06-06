// AnnouncementPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
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
    <Layout>
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
    </Layout>
  );
}

export default Pengumuman;