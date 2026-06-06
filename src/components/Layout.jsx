import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useKeycloak } from '../context/KeycloakContext';
import { Home, User, Megaphone, Shield, LogOut, Menu, X, Settings, ChevronDown, Globe } from 'lucide-react';
import './Layout.css';

import { useThemeLanguage } from '../context/ThemeLanguageContext';

const NAV_ITEMS = [
  { to: '/home', label: 'Beranda', icon: Home },
  { to: '/akun', label: 'Akun', icon: User },
  { to: '/pengumuman', label: 'Pengumuman', icon: Megaphone },
  { to: '/pengaturan', label: 'Pengaturan Web', icon: Settings },
  { to: '/admin', label: 'Admin', icon: Shield },
];

function Layout({ children }) {
  const { logout, isAdmin, profile } = useKeycloak();
  const { language, setLanguage, t } = useThemeLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  // Filter items based on role
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.to === '/admin') return !!isAdmin;
    return true;
  });

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close modals on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (mobileOpen) setMobileOpen(false);
        if (langOpen) setLangOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen, langOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const getInitials = () => {
    if (profile?.firstName) {
      return (profile.firstName[0] + (profile.lastName?.[0] || '')).toUpperCase();
    }
    return (profile?.username?.[0] || 'U').toUpperCase();
  };

  const getNavLabel = (path) => {
    if (path === '/home') return t('nav.home');
    if (path === '/akun') return t('nav.account');
    if (path === '/pengumuman') return t('nav.announcements');
    if (path === '/pengaturan') return t('nav.settings');
    if (path === '/admin') return t('nav.admin');
    return '';
  };

  return (
    <>
      {/* Skip-to-content link (a11y) */}
      <a href="#main-content" className="skip-link">
        {language === 'en' ? 'Skip to main content' : 'Langsung ke konten utama'}
      </a>

      <div className="portal-container">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Global Top Bar */}
        <header className="portal-topbar">
          <div className="topbar-logo-section">
            <button
              className="mobile-toggle"
              onClick={toggleMobile}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              aria-controls="sidebar-nav"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="logo">
              <span>S4RAS</span> Portal
            </h1>
          </div>

          <div className="topbar-actions">
            {/* Language Dropdown */}
            <div className="lang-dropdown-container">
              <button
                className="lang-btn"
                onClick={() => setLangOpen(!langOpen)}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                <span>{language.toUpperCase()}</span>
                <ChevronDown size={14} />
              </button>

              {langOpen && (
                <ul className="lang-menu" role="listbox">
                  <li
                    className={language === 'id' ? 'active' : ''}
                    onClick={() => { setLanguage('id'); setLangOpen(false); }}
                    role="option"
                    aria-selected={language === 'id'}
                  >
                    ID (Bahasa)
                  </li>
                  <li
                    className={language === 'en' ? 'active' : ''}
                    onClick={() => { setLanguage('en'); setLangOpen(false); }}
                    role="option"
                    aria-selected={language === 'en'}
                  >
                    EN (English)
                  </li>
                </ul>
              )}
            </div>

            {/* Profile Avatar Widget */}
            <div className="topbar-profile" title={profile?.email}>
              <div className="avatar-circle">
                {getInitials()}
              </div>
            </div>
          </div>
        </header>

        <div className="portal-body">
          {/* Sidebar */}
          <aside
            id="sidebar-nav"
            className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}
            role="navigation"
            aria-label="Navigasi utama"
          >
            <nav className="sidebar-menu">
              {visibleNavItems.map(({ to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `menu-item ${isActive ? 'menu-item--active' : ''}`
                  }
                  aria-current={location.pathname === to ? 'page' : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{getNavLabel(to)}</span>
                </NavLink>
              ))}
            </nav>

            <button
              className="menu-item menu-item--logout"
              onClick={logout}
              aria-label="Keluar dari akun"
            >
              <LogOut size={18} aria-hidden="true" />
              <span>{t('nav.logout')}</span>
            </button>
          </aside>

          {/* Main content */}
          <main id="main-content" className="main-content" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

export default Layout;
