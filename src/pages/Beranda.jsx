// Beranda — Home Dashboard
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight, Calendar, ArrowDown } from 'lucide-react';
import './Beranda.css';
import Layout from '../components/Layout';
import SkeletonCard from '../components/SkeletonCard';
import StatusBadge from '../components/StatusBadge';
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
  const formattedDate = today.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const weekday = today.toLocaleDateString('id-ID', { weekday: 'long' });

  useEffect(() => {
    let mounted = true;
    fetchAnnouncements().then((data) => {
      if (mounted) { setAnnouncements(data); setLoading(false); }
    }).catch(() => {
      if (mounted) { setLoading(false); }
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadHealth = async () => {
      const results = await Promise.all(services.map(checkServiceHealth));
      if (mounted) { setHealthStatuses(results); setHealthLoading(false); }
    };
    loadHealth();
    return () => { mounted = false; };
  }, []);

  const username = profile?.username || profile?.email || 'Pengguna S4RAS';

  return (
    <Layout>
      <div className="home-layout">
        {/* Left Column — Services Grid */}
        <div className="left-column">
          <section className="card apps-section" aria-label="Aplikasi dan Layanan">
            <h2>Aplikasi dan Layanan</h2>
            <div className="apps-grid">
              {services.map((service) => (
                <a
                  key={service.key}
                  href={service.url}
                  target="_blank"
                  rel="noreferrer"
                  className="app-card"
                  aria-label={`${service.title} — ${service.description}`}
                >
                  <div className="app-icon-wrapper">
                    <span className="app-icon-emoji" aria-hidden="true">{service.icon}</span>
                  </div>
                  <div className="app-info">
                    <div className="app-name">{service.title}</div>
                    <div className="app-desc">{service.description}</div>
                  </div>
                  <ExternalLink size={16} className="app-external" aria-hidden="true" />
                </a>
              ))}
            </div>
            <Link to="/pengumuman" className="show-all-btn">
              <ArrowDown size={16} aria-hidden="true" />
              Lihat Pengumuman
            </Link>
          </section>
        </div>

        {/* Right Column — Profile, Date, Health, Announcements */}
        <div className="right-column">
          {/* Profile Card */}
          <div className="card profile-card">
            <div className="profile-avatar" aria-hidden="true">
              {(username[0] || 'U').toUpperCase()}
            </div>
            <div className="profile-info">
              <div className="profile-name">{username}</div>
              <div className="profile-email">{profile?.email || 'email@domain.com'}</div>
              <Link to="/akun" className="manage-account-link">
                Kelola Akun
                <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Date Card */}
          <div className="card date-card" aria-label={`Hari ini: ${formattedDate}`}>
            <Calendar size={20} aria-hidden="true" />
            <div>
              <div className="day">{weekday}</div>
              <div className="full-date">{formattedDate}</div>
            </div>
          </div>

          {/* Health Card */}
          <div className="card health-card" aria-label="Status layanan">
            <h3>Status Layanan</h3>
            {healthLoading ? (
              <div className="health-skeleton">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} lines={1} />
                ))}
              </div>
            ) : (
              <div className="health-list">
                {healthStatuses.map((status) => {
                  const service = services.find((s) => s.key === status.key);
                  return (
                    <div className="health-row" key={status.key}>
                      <div>
                        <div className="health-name">{service?.title || status.key}</div>
                        <div className="health-detail">{status.details}</div>
                      </div>
                      <StatusBadge status={status.status} label={status.label} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Announcements Card */}
          <div className="card announcements-card" aria-label="Pengumuman terbaru">
            <h3>Pengumuman</h3>
            {loading ? (
              <div className="announcements-skeleton">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} lines={2} showIcon />
                ))}
              </div>
            ) : (
              <div className="announcements-list">
                {announcements.map((item, index) => (
                  <div className="announcement-mini" key={index}>
                    <div className="announcement-dot" aria-hidden="true" />
                    <div>
                      <div className="announcement-title-mini">{item.title}</div>
                      <div className="announcement-desc-mini">{item.description || item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to="/pengumuman" className="view-all-link">
              Lihat Semua Pengumuman
              <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Beranda;
