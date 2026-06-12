// Beranda — Home Dashboard
import { useEffect, useState } from 'react';
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
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import SkeletonCard from '../components/SkeletonCard';
import services from '../config/services';
import { fetchAnnouncements, checkServiceHealth } from '../services/backend';
import { useKeycloak } from '../context/KeycloakContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

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

function Beranda() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [healthStatuses, setHealthStatuses] = useState([]);
  const [healthLoading, setHealthLoading] = useState(true);
  const [activeService, setActiveService] = useState(null);
  const { profile } = useKeycloak();
  const { t, language } = useThemeLanguage();

  const handleRefreshHealth = async () => {
    setHealthLoading(true);
    const results = await Promise.all(services.map(checkServiceHealth));
    setHealthStatuses(results);
    setHealthLoading(false);
  };

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
      <div className="flex flex-col gap-6">

        {/* Welcome Hero Banner with Pexels Background Slider */}
        <section className="card relative min-h-[400px] flex items-end p-8 sm:p-10 overflow-hidden bg-gradient-to-br from-neutral-bg2/70 to-neutral-bg1/85" aria-label="Selamat Datang">
          <div className="absolute inset-0 z-0 w-full h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImages[currentImageIndex]}
                src={activeImages[currentImageIndex]}
                alt="Tech theme background"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 z-1 bg-[linear-gradient(to_top,rgba(20,5,5,0.95)_0%,rgba(185,28,28,0.25)_40%,transparent_100%)] light:bg-[linear-gradient(to_top,rgba(254,242,242,0.95)_0%,rgba(239,68,68,0.12)_40%,transparent_100%)] transition-colors duration-300" />
          </div>
          <div className="relative z-2">
            <h2 className="text-2xl font-bold text-white mb-2">{getGreeting()}, {username}!</h2>
            <p className="text-sm text-white">
              {t('home.today')} <strong>{formattedDate}</strong>. {t('home.sso_login')}
            </p>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column — Application launcher grid */}
          <div className="flex-1 lg:flex-[2.2] flex flex-col gap-6 min-w-0">
            <section className="card flex flex-col gap-6 p-8" aria-label="Aplikasi dan Layanan">
              <h3 className="text-lg font-semibold text-text-primary m-0">{t('home.apps_services')}</h3>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
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
                    className="flex items-center gap-4 p-5 bg-white/2 border border-border-default rounded-xl text-text-primary transition-all duration-200 cursor-pointer hover:bg-white/5 hover:border-brand/30 hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)] group"
                    aria-label={`${service.title} — ${getServiceDesc(service.key, service.description)}`}
                  >
                    <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-brand-subtle flex-shrink-0">
                      <ServiceIcon iconName={service.iconName} size={20} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-text-primary">{service.title}</div>
                      <div className="text-xs text-text-secondary mt-1 overflow-hidden text-ellipsis whitespace-nowrap">{getServiceDesc(service.key, service.description)}</div>
                    </div>
                    <ExternalLink size={14} className="text-text-muted opacity-40 flex-shrink-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:text-brand-light" aria-hidden="true" />
                  </motion.a>
                ))}
              </motion.div>
            </section>

            {/* Quick Informational Notice */}
            <div className="card flex items-center gap-4 p-5 bg-white/1 border-l-3 border-brand-light rounded-r-lg rounded-l-none">
              <AlertCircle size={18} className="text-brand-light flex-shrink-0" />
              <div className="text-[0.8125rem] text-text-secondary leading-relaxed">
                {t('home.notice.text1')}
                <Link to="/pengaturan" className="text-brand-light font-semibold hover:underline">{t('home.notice.link')}</Link>
                {t('home.notice.text2')}
              </div>
            </div>
          </div>

          {/* Right Column — User widget and services status */}
          <div className="flex-1 flex flex-col gap-6 lg:min-w-[300px]">
            {/* Quick Profile widget */}
            <div className="card flex flex-col gap-5 p-6 bg-gradient-to-br from-neutral-bg2/50 to-neutral-bg1/70 light:from-white/90 light:to-gray-100/90">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-subtle text-brand-light border border-brand/15">
                  <User size={24} />
                </div>
                <div className="widget-info">
                  <h4 className="text-[0.9375rem] font-semibold text-text-primary mb-0.5">{username}</h4>
                  <p className="text-xs text-text-secondary">{profile?.email || 'email@domain.com'}</p>
                </div>
              </div>
              <Link to="/akun" className="flex items-center justify-between p-3.5 bg-neutral-bg3 border border-border-default rounded-lg text-text-primary text-[0.8125rem] font-semibold transition-all hover:bg-neutral-bg4 hover:border-border-strong">
                <span>{t('account.manage_btn')}</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Health Checklist Status */}
            <div className="card flex flex-col p-6 relative overflow-hidden" aria-label="Status Layanan">
              <h4 className="flex items-center justify-between text-sm font-semibold text-text-primary mb-4 w-full">
                <div className="flex items-center gap-3">
                  <Activity size={16} />
                  <span>{t('home.service_status')}</span>
                </div>
                <button 
                  onClick={handleRefreshHealth}
                  disabled={healthLoading}
                  className={`p-1.5 rounded-lg text-text-secondary hover:text-brand-light hover:bg-neutral-bg3 transition-all ${healthLoading ? 'animate-spin opacity-50' : ''}`}
                  title="Perbarui status koneksi"
                >
                  <RefreshCw size={14} />
                </button>
              </h4>

              {healthLoading ? (
                <div className="relative w-full h-[180px] flex items-center justify-center bg-neutral-bg3/20 rounded-xl border border-border-default overflow-hidden animate-pulse mb-4">
                  <svg viewBox="0 0 320 180" className="w-full h-full opacity-25">
                    {[
                      { cx: 55, cy: 40 },
                      { cx: 160, cy: 22 },
                      { cx: 265, cy: 40 },
                      { cx: 265, cy: 130 },
                      { cx: 160, cy: 148 },
                      { cx: 55, cy: 130 }
                    ].map((node, idx) => (
                      <line key={idx} x1="160" y1="85" x2={node.cx} y2={node.cy} stroke="var(--color-text-muted)" strokeWidth="1" strokeDasharray="3,3" />
                    ))}
                    <circle cx="160" cy="85" r="10" fill="var(--color-text-muted)" />
                    {[
                      { cx: 55, cy: 40 },
                      { cx: 160, cy: 22 },
                      { cx: 265, cy: 40 },
                      { cx: 265, cy: 130 },
                      { cx: 160, cy: 148 },
                      { cx: 55, cy: 130 }
                    ].map((node, idx) => (
                      <circle key={idx} cx={node.cx} cy={node.cy} r="6" fill="var(--color-text-muted)" />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-text-secondary font-medium">
                    {language === 'en' ? 'Scanning connections...' : 'Memindai koneksi...'}
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-[180px] bg-neutral-bg3/20 rounded-xl border border-border-default overflow-hidden mb-4">
                  {/* SVG Topology Connection Map */}
                  <svg viewBox="0 0 320 180" className="w-full h-full">
                    {/* Connection lines */}
                    {[
                      { key: 'moodle', cx: 55, cy: 40 },
                      { key: 'sso', cx: 160, cy: 22 },
                      { key: 'cloud', cx: 265, cy: 40 },
                      { key: 'iptv', cx: 265, cy: 130 },
                      { key: 'voip', cx: 160, cy: 148 },
                      { key: 'monitor', cx: 55, cy: 130 }
                    ].map((node) => {
                      const status = healthStatuses.find((h) => h.key === node.key);
                      const isOnline = status?.status === 'online';
                      const isOffline = status?.status === 'offline';
                      const isHovered = activeService === node.key;
                      
                      let strokeColor = 'rgba(112, 126, 174, 0.2)';
                      let strokeWidth = isHovered ? '2' : '1.2';
                      let dashArray = undefined;

                      if (isOnline) {
                        strokeColor = isHovered ? 'rgba(16, 185, 129, 0.75)' : 'rgba(16, 185, 129, 0.35)';
                      } else if (isOffline) {
                        strokeColor = isHovered ? 'rgba(239, 68, 68, 0.65)' : 'rgba(239, 68, 68, 0.3)';
                        dashArray = '3,3';
                      }

                      return (
                        <g key={`line-${node.key}`}>
                          {isHovered && isOnline && (
                            <line 
                              x1="160" 
                              y1="85" 
                              x2={node.cx} 
                              y2={node.cy} 
                              stroke="rgba(16, 185, 129, 0.2)" 
                              strokeWidth="6" 
                              strokeLinecap="round"
                            />
                          )}
                          <line
                            x1="160"
                            y1="85"
                            x2={node.cx}
                            y2={node.cy}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeDasharray={dashArray}
                            strokeLinecap="round"
                            className="transition-all duration-200"
                          />
                          {isOnline && (
                            <circle r={isHovered ? 3.5 : 2.5} fill="#10b981" className="filter drop-shadow-[0_0_3px_#10b981]">
                              <animateMotion dur="2.5s" repeatCount="indefinite" path={`M 160 85 L ${node.cx} ${node.cy}`} />
                            </circle>
                          )}
                        </g>
                      );
                    })}

                    {/* Central Core (Portal S4RAS) */}
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setActiveService('portal')}
                      onMouseLeave={() => setActiveService(null)}
                    >
                      <circle 
                        cx="160" 
                        cy="85" 
                        r={activeService === 'portal' ? 20 : 16} 
                        fill="rgba(185, 28, 28, 0.08)" 
                        className="transition-all duration-200" 
                      />
                      <circle 
                        cx="160" 
                        cy="85" 
                        r={activeService === 'portal' ? 14 : 11} 
                        fill="var(--color-brand)" 
                        className="transition-all duration-200 filter drop-shadow-[0_0_6px_var(--color-brand)]"
                        opacity="0.85" 
                      />
                      <circle cx="160" cy="85" r="4.5" fill="#ffffff" />
                      <text 
                        x="160" 
                        y="108" 
                        textAnchor="middle" 
                        className="text-[8.5px] font-bold fill-text-primary tracking-wide select-none"
                      >
                        Portal S4RAS
                      </text>
                    </g>

                    {/* Peripheral nodes */}
                    {[
                      { key: 'moodle', title: 'Moodle', cx: 55, cy: 40, textAnchor: 'end', tx: 42, ty: 43 },
                      { key: 'sso', title: 'SSO', cx: 160, cy: 22, textAnchor: 'middle', tx: 160, ty: 12 },
                      { key: 'cloud', title: 'Nextcloud', cx: 265, cy: 40, textAnchor: 'start', tx: 278, ty: 43 },
                      { key: 'iptv', title: 'IPTV', cx: 265, cy: 130, textAnchor: 'start', tx: 278, ty: 133 },
                      { key: 'voip', title: 'VoIP', cx: 160, cy: 148, textAnchor: 'middle', tx: 160, ty: 162 },
                      { key: 'monitor', title: 'Monitor', cx: 55, cy: 130, textAnchor: 'end', tx: 42, ty: 133 }
                    ].map((node) => {
                      const status = healthStatuses.find((h) => h.key === node.key);
                      const isOnline = status?.status === 'online';
                      const isOffline = status?.status === 'offline';
                      const isHovered = activeService === node.key;

                      let nodeColor = 'var(--color-text-muted)';
                      let nodeRadius = isHovered ? 7.5 : 5.5;

                      if (isOnline) nodeColor = '#10b981';
                      else if (isOffline) nodeColor = '#ef4444';

                      return (
                        <g
                          key={`node-${node.key}`}
                          className="cursor-pointer"
                          onMouseEnter={() => setActiveService(node.key)}
                          onMouseLeave={() => setActiveService(null)}
                        >
                          {isOnline && (
                            <circle
                              cx={node.cx}
                              cy={node.cy}
                              r={isHovered ? 13 : 10}
                              fill="rgba(16, 185, 129, 0.15)"
                              className="animate-pulse"
                            />
                          )}
                          {isOffline && (
                            <circle
                              cx={node.cx}
                              cy={node.cy}
                              r={isHovered ? 13 : 10}
                              fill="rgba(239, 68, 68, 0.1)"
                            />
                          )}
                          <circle
                            cx={node.cx}
                            cy={node.cy}
                            r={nodeRadius}
                            fill={nodeColor}
                            className="transition-all duration-200 filter drop-shadow-[0_0_4px_currentColor]"
                            style={{ color: nodeColor }}
                          />
                          <text
                            x={node.tx}
                            y={node.ty}
                            textAnchor={node.textAnchor}
                            className={`text-[8px] font-semibold transition-all duration-200 select-none ${
                              isHovered ? 'fill-text-primary text-[9px]' : 'fill-text-secondary'
                            }`}
                          >
                            {node.title}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}

              {healthLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} lines={1} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
                  {services.map((service) => {
                    const status = healthStatuses.find((h) => h.key === service.key);
                    const isOnline = status?.status === 'online';
                    const latency = status?.latency;
                    const isHovered = activeService === service.key;

                    return (
                      <div 
                        key={service.key}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 ${
                          isHovered 
                            ? 'bg-neutral-bg3/80 border-brand/20 shadow-[0_4px_12px_rgba(185,28,28,0.06)]' 
                            : 'bg-transparent border-transparent hover:bg-neutral-bg3/30'
                        }`}
                        onMouseEnter={() => setActiveService(service.key)}
                        onMouseLeave={() => setActiveService(null)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors flex-shrink-0 ${
                            isOnline 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' 
                              : 'bg-red-500/10 text-red-400 border border-red-500/15'
                          }`}>
                            <ServiceIcon iconName={service.iconName} size={16} />
                          </div>
                          
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[0.8125rem] font-semibold text-text-primary truncate">{service.title}</span>
                              <a 
                                href={service.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-text-muted hover:text-brand-light transition-colors flex-shrink-0"
                                title={`Buka ${service.title}`}
                              >
                                <ExternalLink size={11} />
                              </a>
                            </div>
                            <span className="text-[0.6875rem] text-text-secondary truncate mt-0.5">{service.url}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isOnline && latency !== undefined && (
                            <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                              latency < 50 
                                ? 'bg-emerald-500/12 text-emerald-400' 
                                : latency < 150 
                                  ? 'bg-amber-500/12 text-amber-400' 
                                  : 'bg-red-500/12 text-red-400'
                            }`}>
                              {latency} ms
                            </span>
                          )}
                          
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-bold border ${
                            isOnline 
                              ? 'bg-emerald-500/8 text-emerald-400 border-emerald-500/15' 
                              : 'bg-red-500/8 text-red-400 border-red-500/15'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Announcements widget */}
            <div className="card flex flex-col p-6" aria-label="Pengumuman Terbaru">
              <h4 className="flex items-center gap-3 text-sm font-semibold text-text-primary mb-4">{t('home.ann.title')}</h4>
              {loading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} lines={2} showIcon />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {announcements.slice(0, 3).map((item, index) => (
                    <div className="flex gap-3 items-start" key={index}>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-light flex-shrink-0 mt-1.5" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.8125rem] font-semibold text-text-primary">{item.title}</div>
                        <div className="text-xs text-text-secondary mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">{item.description || item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/pengumuman" className="flex items-center justify-end gap-1 text-brand-light text-xs font-semibold mt-5 pt-3 border-t border-border-default transition-all hover:gap-2">
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
