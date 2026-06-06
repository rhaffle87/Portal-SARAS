import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useKeycloak } from '../context/KeycloakContext';
import { Home, User, Megaphone, Shield, LogOut, Menu, X, Settings, ChevronDown } from 'lucide-react';

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
      <a href="#main-content" className="absolute top-[-100%] focus:top-4 left-4 z-[100] px-4 py-2 bg-brand text-white rounded-md font-semibold transition-[top] duration-200">
        {language === 'en' ? 'Skip to main content' : 'Langsung ke konten utama'}
      </a>

      <div className="flex flex-col h-screen bg-transparent relative overflow-hidden z-1">
        {/* Ambient background glows */}
        <div className="fixed rounded-full pointer-events-none z-[-1] blur-[120px] will-change-[transform,opacity] top-[10%] left-[-250px] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(239,68,68,0.16)_0%,transparent_90%)] light:bg-[radial-gradient(circle,rgba(239,68,68,0.06)_0%,transparent_90%)] animate-pulse-glow-1" aria-hidden="true" />
        <div className="fixed rounded-full pointer-events-none z-[-1] blur-[120px] will-change-[transform,opacity] bottom-[-200px] right-[-200px] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(239,68,68,0.10)_0%,transparent_90%)] light:bg-[radial-gradient(circle,rgba(239,68,68,0.03)_0%,transparent_90%)] animate-pulse-glow-2" aria-hidden="true" />
        
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-[4px] z-25"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Global Top Bar */}
        <header className="sticky top-0 h-16 bg-neutral-bg1/80 light:bg-white/80 backdrop-blur-lg border-b border-border-default flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden bg-transparent border-none text-text-primary cursor-pointer p-2 rounded-md transition-colors duration-200 hover:bg-white/5"
              onClick={toggleMobile}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              aria-controls="sidebar-nav"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="text-xl font-bold tracking-tight text-text-primary m-0">
              <span className="text-brand-light">S4RAS</span> Portal
            </h1>
          </div>

          <div className="flex items-center gap-5">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1.5 bg-white/4 light:bg-black/3 border border-border-default text-text-secondary text-[0.8125rem] font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 hover:bg-white/8 light:hover:bg-black/6 hover:text-text-primary"
                onClick={() => setLangOpen(!langOpen)}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                <span>{language.toUpperCase()}</span>
                <ChevronDown size={14} />
              </button>

              {langOpen && (
                <ul className="absolute top-[120%] right-0 z-50 bg-neutral-bg2 border border-border-default rounded-lg p-1 shadow-[0_10px_25px_rgba(0,0,0,0.45)] list-none m-0 min-w-[120px]" role="listbox">
                  <li
                    className={`px-3 py-2 text-[0.8125rem] cursor-pointer rounded-md transition-all duration-150 ${language === 'id' ? 'text-brand-light bg-brand-subtle font-semibold' : 'text-text-secondary hover:bg-neutral-bg3 hover:text-text-primary'}`}
                    onClick={() => { setLanguage('id'); setLangOpen(false); }}
                    role="option"
                    aria-selected={language === 'id'}
                  >
                    ID (Bahasa)
                  </li>
                  <li
                    className={`px-3 py-2 text-[0.8125rem] cursor-pointer rounded-md transition-all duration-150 ${language === 'en' ? 'text-brand-light bg-brand-subtle font-semibold' : 'text-text-secondary hover:bg-neutral-bg3 hover:text-text-primary'}`}
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
            <div className="flex items-center" title={profile?.email}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-light to-brand text-white text-sm font-bold flex items-center justify-center shadow-[0_2px_10px_rgba(185,28,28,0.25)] border border-white/10 light:border-black/8">
                {getInitials()}
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 relative overflow-hidden">
          {/* Sidebar */}
          <aside
            id="sidebar-nav"
            className={`w-[250px] bg-neutral-bg2 border-r border-border-default flex flex-col justify-between p-6 h-full transition-transform duration-300 ease-in-out z-30 max-lg:fixed max-lg:top-16 max-lg:bottom-0 max-lg:left-0 max-lg:shadow-[10px_0_30px_rgba(0,0,0,0.5)] lg:translate-x-0 ${mobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}`}
            role="navigation"
            aria-label="Navigasi utama"
          >
            <nav className="flex flex-col gap-1.5">
              {visibleNavItems.map(({ to, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 text-text-secondary text-sm font-medium rounded-lg bg-transparent border-none w-full text-left cursor-pointer transition-all duration-200 hover:bg-neutral-bg3 hover:text-text-primary ${isActive ? '!bg-brand !text-white font-semibold shadow-[0_4px_15px_rgba(185,28,28,0.3)]' : ''}`
                  }
                  aria-current={location.pathname === to ? 'page' : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{getNavLabel(to)}</span>
                </NavLink>
              ))}
            </nav>

            <button
              className="flex items-center gap-3.5 px-4 py-3 text-status-error hover:bg-red-500/10 text-sm font-medium rounded-lg bg-transparent border-none w-full text-left cursor-pointer transition-all duration-200 mt-auto"
              onClick={logout}
              aria-label="Keluar dari akun"
            >
              <LogOut size={18} aria-hidden="true" />
              <span>{t('nav.logout')}</span>
            </button>
          </aside>

          {/* Main content */}
          <main id="main-content" className="flex-1 overflow-y-auto h-full box-border" tabIndex={-1}>
            <div className="max-w-[1400px] mx-auto w-full px-12 py-8 max-lg:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Layout;
