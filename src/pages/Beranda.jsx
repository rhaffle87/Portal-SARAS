// Beranda — Home Dashboard
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight, Calendar, ArrowDown, User, Activity, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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

  const getGreeting = () => {
    const hr = today.getHours();
    if (hr < 11) return 'Selamat pagi';
    if (hr < 15) return 'Selamat siang';
    if (hr < 19) return 'Selamat sore';
    return 'Selamat malam';
  };

  const username = profile?.firstName 
    ? `${profile.firstName} ${profile.lastName || ''}`.trim()
    : profile?.username || profile?.email || 'Pengguna S4RAS';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <div className="dashboard-container">
        
        {/* Welcome Hero Banner */}
        <section className="welcome-banner card" aria-label="Selamat Datang">
          <div className="welcome-banner-content">
            <h2 className="welcome-title">{getGreeting()}, {username}!</h2>
            <p className="welcome-subtitle">
              Hari ini adalah <strong>{formattedDate}</strong>. Anda login menggunakan Single Sign-On (SSO) Portal S4RAS.
            </p>
          </div>
        </section>

        <div className="home-layout">
          {/* Left Column — Application launcher grid */}
          <div className="left-column">
            <section className="card apps-section" aria-label="Aplikasi dan Layanan">
              <h3 className="section-title">Aplikasi dan Layanan</h3>
              <motion.div 
                className="apps-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {services.map((service) => (
                  <motion.a
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
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
                    <ExternalLink size={14} className="app-external" aria-hidden="true" />
                  </motion.a>
                ))}
              </motion.div>
            </section>

            {/* Quick Informational Notice */}
            <div className="card notice-banner">
              <AlertCircle size={18} className="notice-icon" />
              <div className="notice-text">
                Butuh bantuan login atau integrasi SSO? Kunjungi halaman <Link to="/pengaturan">Pengaturan Web</Link> atau hubungi admin portal.
              </div>
            </div>
          </div>

          {/* Right Column — User widget and services status */}
          <div className="right-column">
            {/* Quick Profile widget */}
            <div className="card profile-widget">
              <div className="profile-widget-header">
                <div className="widget-avatar">
                  <User size={24} />
                </div>
                <div className="widget-info">
                  <h4 className="widget-name">{username}</h4>
                  <p className="widget-email">{profile?.email || 'email@domain.com'}</p>
                </div>
              </div>
              <Link to="/akun" className="widget-action-btn">
                <span>Kelola Profil Akun</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Health Checklist Status */}
            <div className="card health-card" aria-label="Status Layanan">
              <h4 className="widget-heading">
                <Activity size={16} />
                <span>Status Layanan</span>
              </h4>
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
                        <div className="health-meta">
                          <span className="health-name">{service?.title || status.key}</span>
                          <span className="health-detail">{status.details}</span>
                        </div>
                        <StatusBadge status={status.status} label={status.label} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Announcements widget */}
            <div className="card announcements-widget" aria-label="Pengumuman Terbaru">
              <h4 className="widget-heading">Pengumuman Terbaru</h4>
              {loading ? (
                <div className="announcements-skeleton">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} lines={2} showIcon />
                  ))}
                </div>
              ) : (
                <div className="announcements-list">
                  {announcements.slice(0, 3).map((item, index) => (
                    <div className="announcement-mini" key={index}>
                      <div className="announcement-dot" aria-hidden="true" />
                      <div className="announcement-mini-content">
                        <div className="announcement-title-mini">{item.title}</div>
                        <div className="announcement-desc-mini">{item.description || item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/pengumuman" className="widget-footer-link">
                <span>Lihat semua pengumuman</span>
                <ChevronRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Beranda;
