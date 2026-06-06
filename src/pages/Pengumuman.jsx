// Pengumuman — Announcements Page
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Bell } from 'lucide-react';
import Layout from '../components/Layout';
import SkeletonCard from '../components/SkeletonCard';
import './Pengumuman.css';
import { fetchAnnouncements } from '../services/backend';

function Pengumuman() {
  const [announcements, setAnnouncements] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    fetchAnnouncements()
      .then((data) => {
        if (active) { setAnnouncements(data); setLoading(false); }
      })
      .catch(() => {
        if (active) { setLoading(false); }
      });
    return () => { active = false; };
  }, []);

  return (
    <Layout>
      <div className="pengumuman-header">
        <h2>Pengumuman</h2>
        <button
          className="search-btn"
          type="button"
          aria-label="Cari pengumuman"
        >
          <Search size={18} aria-hidden="true" />
        </button>
      </div>

      {loading ? (
        <div className="pengumuman-grid" aria-busy="true" aria-label="Memuat pengumuman">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="card pengumuman-skeleton-card" key={i}>
              <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
              <div className="skeleton" style={{ width: '70%', height: 16, marginTop: 12 }} />
              <div className="skeleton" style={{ width: '100%', height: 14, marginTop: 8 }} />
              <div className="skeleton" style={{ width: '40%', height: 14, marginTop: 8 }} />
              <div className="skeleton" style={{ width: 60, height: 24, marginTop: 16, borderRadius: 12 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="pengumuman-grid" role="list" aria-label="Daftar pengumuman">
          {announcements.map((item, index) => (
            <article className="card pengumuman-card" key={index} role="listitem">
              <div className="pengumuman-icon-wrapper">
                <Bell size={18} aria-hidden="true" />
              </div>
              <div className="pengumuman-title">{item.title}</div>
              <div className="pengumuman-desc">{item.description || item.desc}</div>
              <span className="pengumuman-badge">{item.badge || item.badgeText || 'Info'}</span>
            </article>
          ))}
        </div>
      )}

      <div className="actions-row" style={{ marginTop: 32 }}>
        <Link to="/home" className="action-button">
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali ke Beranda
        </Link>
      </div>
    </Layout>
  );
}

export default Pengumuman;