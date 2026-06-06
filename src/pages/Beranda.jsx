// Beranda — Home Dashboard
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  ChevronRight, 
  User, 
  Activity, 
  AlertCircle,
  GraduationCap,
  KeyRound,
  Cloud,
  Tv,
  Phone,
  BarChart3
} from 'lucide-react';

const ServiceIcon = ({ iconName, size = 20, className }) => {
  const IconComponent = {
    GraduationCap,
    KeyRound,
    Cloud,
    Tv,
    Phone,
    BarChart3
  }[iconName] || Activity;
  
  return <IconComponent size={size} className={className} />;
};
import { motion, AnimatePresence } from 'framer-motion';
import './Beranda.css';
import Layout from '../components/Layout';
import SkeletonCard from '../components/SkeletonCard';
import StatusBadge from '../components/StatusBadge';
import services from '../config/services';
import { fetchAnnouncements, checkServiceHealth } from '../services/backend';
import { useKeycloak } from '../context/KeycloakContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

function Beranda() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [healthStatuses, setHealthStatuses] = useState([]);
  const [healthLoading, setHealthLoading] = useState(true);
  const { profile } = useKeycloak();
  const { t, language } = useThemeLanguage();

  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const today = new Date();
  const formattedDate = today.toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

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

  // Fetch images from Pexels
  useEffect(() => {
    let mounted = true;
    const fetchPexelsImages = async () => {
      try {
        const res = await fetch('https://api.pexels.com/v1/search?query=technology&per_page=6', {
          headers: {
            Authorization: 'DMZgUhy3pvR7MFfeFHhq0VQAPV316svu1vgGdTYJVVH5t0ltDy7RxUCa'
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.photos && data.photos.length > 0) {
            const urls = data.photos.map(p => p.src.large2x || p.src.large);
            setImages(urls);
          }
        }
      } catch (err) {
        console.error('Failed to fetch images from Pexels:', err);
      }
    };
    fetchPexelsImages();
    return () => { mounted = false; };
  }, []);

  // Sliding timer
  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000); // change image every 6 seconds
    return () => clearInterval(timer);
  }, [images]);

  const getGreeting = () => {
    const hr = today.getHours();
    if (hr < 11) return t('home.greeting.morning');
    if (hr < 15) return t('home.greeting.afternoon');
    if (hr < 19) return t('home.greeting.evening');
    return t('home.greeting.night');
  };

  const username = profile?.firstName 
    ? `${profile.firstName} ${profile.lastName || ''}`.trim()
    : profile?.username || profile?.email || 'Pengguna S4RAS';

  const fallbackImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1920&auto=format&fit=crop'
  ];
  const activeImages = images.length > 0 ? images : fallbackImages;

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

  const getServiceDesc = (key, defaultDesc) => {
    const translationKey = `service.desc.${key}`;
    const trans = t(translationKey);
    return trans === translationKey ? defaultDesc : trans;
  };

  return (
    <Layout>
      <div className="dashboard-container">
        
        {/* Welcome Hero Banner with Pexels Background Slider */}
        <section className="welcome-banner card" aria-label="Selamat Datang">
          <div className="welcome-banner-bg">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImages[currentImageIndex]}
                src={activeImages[currentImageIndex]}
                alt="Tech theme background"
                className="welcome-banner-image"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            </AnimatePresence>
            <div className="welcome-banner-overlay" />
          </div>
          <div className="welcome-banner-content">
            <h2 className="welcome-title">{getGreeting()}, {username}!</h2>
            <p className="welcome-subtitle">
              {t('home.today')} <strong>{formattedDate}</strong>. {t('home.sso_login')}
            </p>
          </div>
        </section>

        <div className="home-layout">
          {/* Left Column — Application launcher grid */}
          <div className="left-column">
            <section className="card apps-section" aria-label="Aplikasi dan Layanan">
              <h3 className="section-title">{t('home.apps_services')}</h3>
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
                    aria-label={`${service.title} — ${getServiceDesc(service.key, service.description)}`}
                  >
                    <div className="app-icon-wrapper">
                      <ServiceIcon iconName={service.iconName} size={20} aria-hidden="true" />
                    </div>
                    <div className="app-info">
                      <div className="app-name">{service.title}</div>
                      <div className="app-desc">{getServiceDesc(service.key, service.description)}</div>
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
                {t('home.notice.text1')}
                <Link to="/pengaturan">{t('home.notice.link')}</Link>
                {t('home.notice.text2')}
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
                <span>{t('account.manage_btn')}</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Health Checklist Status */}
            <div className="card health-card" aria-label="Status Layanan">
              <h4 className="widget-heading">
                <Activity size={16} />
                <span>{t('home.service_status')}</span>
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
                        <StatusBadge status={status.status} label={status.status === 'online' ? t('home.status.online') : t('home.status.offline')} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Announcements widget */}
            <div className="card announcements-widget" aria-label="Pengumuman Terbaru">
              <h4 className="widget-heading">{t('home.ann.title')}</h4>
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
                <span>{t('home.ann.view_all')}</span>
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
