// Pengumuman — Announcements Page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { fetchAnnouncements } from '../services/backend';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

function Pengumuman() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useThemeLanguage();

  useEffect(() => {
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

  const filteredAnnouncements = announcements.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = (item.description || item.desc || '').toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || descMatch;
  });

  const getBadgeStyle = (badge) => {
    const tag = (badge || '').toLowerCase();
    const base = 'px-3 py-1 text-[0.6875rem] font-bold rounded-full inline-block leading-none ';
    if (tag.includes('penting') || tag.includes('urgent') || tag.includes('danger')) {
      return base + 'bg-red-500/12 text-red-300 border border-red-500/25 light:bg-red-500/8 light:text-red-600 light:border-red-500/20';
    }
    if (tag.includes('info') || tag.includes('sistem')) {
      return base + 'bg-blue-500/12 text-blue-300 border border-blue-500/25 light:bg-blue-500/8 light:text-blue-600 light:border-blue-500/20';
    }
    if (tag.includes('baru') || tag.includes('update') || tag.includes('fitur')) {
      return base + 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 light:bg-emerald-500/8 light:text-emerald-600 light:border-emerald-500/20';
    }
    return base + 'bg-white/4 text-gray-300 border border-white/8 light:bg-black/4 light:text-text-secondary light:border-black/8';
  };

  // Animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 flex-wrap">
          <h2 className="text-[1.75rem] font-semibold text-text-primary m-0">{t('ann.title')}</h2>
            
            {/* Search Input Bar */}
            <div className="relative w-full sm:w-[300px] flex items-center">
              <Search size={18} className="absolute left-3.5 text-text-muted pointer-events-none" />
              <input
                type="text"
                placeholder={t('ann.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-full text-text-primary text-[0.8125rem] glass-input"
              />
              {searchTerm && (
                <button 
                  className="absolute right-3.5 bg-none border-none text-text-muted cursor-pointer flex items-center justify-center p-0.5 rounded-full transition-all hover:text-text-primary hover:bg-white/8 light:hover:bg-black/5" 
                  onClick={() => setSearchTerm('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true" aria-label={t('ann.loading')}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="card min-h-[160px] flex flex-col justify-between" key={i}>
                <div>
                  <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  <div className="skeleton" style={{ width: '70%', height: 16, marginTop: 12 }} />
                  <div className="skeleton" style={{ width: '100%', height: 14, marginTop: 8 }} />
                  <div className="skeleton" style={{ width: '40%', height: 14, marginTop: 8 }} />
                </div>
                <div className="skeleton" style={{ width: 60, height: 24, marginTop: 16, borderRadius: 12 }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredAnnouncements.length === 0 ? (
              <div className="card flex flex-col items-center justify-center py-16 px-8 text-center text-text-secondary">
                <Bell size={40} className="text-text-muted mb-4" />
                <p>{t('ann.no_results')}</p>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                role="list" 
                aria-label={t('ann.title')}
              >
                <AnimatePresence mode="popLayout">
                  {filteredAnnouncements.map((item, index) => (
                    <motion.article 
                      variants={cardVariants}
                      whileHover={{ scale: 1.01, translateY: -2 }}
                      layout
                      key={index}
                      className="card flex flex-col gap-4 p-6 hover:border-brand/25 hover:shadow-[0_10px_25px_rgba(0,0,0,0.35)] light:hover:shadow-[0_10px_25px_rgba(0,0,0,0.04)] transition-all duration-200" 
                      role="listitem"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-bg3 text-brand-light">
                          <Bell size={16} aria-hidden="true" />
                        </div>
                        <span className={getBadgeStyle(item.badge || item.badgeText)}>
                          {item.badge || item.badgeText || 'Info'}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[0.9375rem] font-semibold text-text-primary leading-normal m-0">{item.title}</h3>
                        <p className="text-[0.8125rem] text-text-secondary leading-relaxed m-0 line-clamp-3">{item.description || item.desc}</p>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Pengumuman;