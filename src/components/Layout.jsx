import React from 'react';
import { NavLink } from 'react-router-dom';
import { useKeycloak } from '../context/KeycloakContext';
import './Layout.css';

function Layout({ children }) {
  const { logout } = useKeycloak();

  return (
    <div className="portal-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo"><span>S4RAS</span> Portal</h1>
        </div>
        <nav className="sidebar-menu">
          <NavLink to="/home" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            🏠 Beranda
          </NavLink>
          <NavLink to="/akun" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            👤 Akun
          </NavLink>
          <NavLink to="/pengumuman" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            📢 Pengumuman
          </NavLink>
        </nav>
        <button className="menu-item" onClick={logout} style={{ marginTop: 'auto', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left', fontFamily: 'inherit', fontSize: 'inherit' }}>
          ⏻ Logout
        </button>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
