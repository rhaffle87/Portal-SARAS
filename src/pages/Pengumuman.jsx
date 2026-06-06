// Pengumuman — Announcements Page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import SkeletonCard from '../components/SkeletonCard';
import './Pengumuman.css';
import { fetchAnnouncements } from '../services/backend';

function Pengumuman() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (tag.includes('penting') || tag.includes('urgent') || tag.includes('danger')) {
      return 'badge--danger';
    }
    if (tag.includes('info') || tag.includes('sistem')) {
      return 'badge--info';
    }
    if (tag.includes('baru') || tag.includes('update') || tag.includes('fitur')) {
      return 'badge--success';
    }
    return 'badge--default';
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
      <div className="announcements-page">
        {/* Back Link Header */}
        <div className="page-header-nav">
          <Link to="/home" className="back-link">
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
          
          <div className="header-search-row">
            <h2 className="page-title">Daftar Pengumuman</h2>
            
            {/* Search Input Bar */}
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Cari pengumuman..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input glass-input"
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
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
          <>
            {filteredAnnouncements.length === 0 ? (
              <div className="card empty-state">
                <Bell size={40} className="empty-state-icon" />
                <p>Tidak ada pengumuman yang cocok dengan pencarian Anda.</p>
              </div>
            ) : (
              <motion.div 
                className="pengumuman-grid" 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                role="list" 
                aria-label="Daftar pengumuman"
              >
                <AnimatePresence mode="popLayout">
                  {filteredAnnouncements.map((item, index) => (
                    <motion.article 
                      variants={cardVariants}
                      whileHover={{ scale: 1.01, translateY: -2 }}
                      layout
                      key={index}
                      className="card pengumuman-card" 
                      role="listitem"
                    >
                      <div className="pengumuman-card-header">
                        <div className="pengumuman-icon-wrapper">
                          <Bell size={16} aria-hidden="true" />
                        </div>
                        <span className={`pengumuman-badge ${getBadgeStyle(item.badge || item.badgeText)}`}>
                          {item.badge || item.badgeText || 'Info'}
                        </span>
                      </div>
                      
                      <div className="pengumuman-content">
                        <h3 className="pengumuman-title">{item.title}</h3>
                        <p className="pengumuman-desc">{item.description || item.desc}</p>
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