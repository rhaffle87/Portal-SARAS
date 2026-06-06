import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useKeycloak } from '../context/KeycloakContext';
import { Home, User, Megaphone, Shield, LogOut, Menu, X } from 'lucide-react';
import './Layout.css';

const NAV_ITEMS = [
  { to: '/home', label: 'Beranda', icon: Home },
  { to: '/akun', label: 'Akun', icon: User },
  { to: '/pengumuman', label: 'Pengumuman', icon: Megaphone },
  { to: '/admin', label: 'Admin', icon: Shield },
];

function Layout({ children }) {
  const { logout } = useKeycloak();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

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

  return (
    <>
      {/* Skip-to-content link (a11y) */}
      <a href="#main-content" className="skip-link">
        Langsung ke konten utama
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

        {/* Mobile header bar */}
        <header className="mobile-header">
          <button
            className="mobile-toggle"
            onClick={toggleMobile}
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileOpen}
            aria-controls="sidebar-nav"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="mobile-logo"><span>S4RAS</span> Portal</h1>
        </header>

        {/* Sidebar */}
        <aside
          id="sidebar-nav"
          className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}
          role="navigation"
          aria-label="Navigasi utama"
        >
          <div className="sidebar-header">
            <h1 className="logo"><span>S4RAS</span> Portal</h1>
          </div>

          <nav className="sidebar-menu">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `menu-item ${isActive ? 'menu-item--active' : ''}`
                }
                aria-current={location.pathname === to ? 'page' : undefined}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <button
            className="menu-item menu-item--logout"
            onClick={logout}
            aria-label="Keluar dari akun"
          >
            <LogOut size={20} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </aside>

        {/* Main content */}
        <main id="main-content" className="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </>
  );
}

export default Layout;
