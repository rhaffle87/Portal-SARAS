// Akun — Account Page
import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Calendar, Mail, Phone, KeyRound, Settings, ChevronRight, ArrowLeft } from 'lucide-react';
import { useKeycloak } from '../context/KeycloakContext';
import Layout from '../components/Layout';
import './Akun.css';

const dataSections = [
  {
    title: 'Informasi Pribadi',
    subtitle: 'Data diri Anda yang terintegrasi pada sistem SSO S4RAS',
    items: [
      { icon: UserCircle, title: 'Nama Lengkap', valueKey: 'name', subtitle: 'Nama lengkap terdaftar' },
      { icon: Calendar, title: 'Username / ID', valueKey: 'username', subtitle: 'ID unik pengguna' },
    ],
  },
  {
    title: 'Hubungan Kontak',
    subtitle: 'Alamat email aktif untuk notifikasi sistem',
    items: [
      { icon: Mail, title: 'Email Utama', valueKey: 'email', subtitle: 'Email aktif untuk autentikasi' },
    ],
  },
];

function Akun() {
  const { profile } = useKeycloak();
  
  const getFullName = () => {
    if (profile?.firstName) {
      return `${profile.firstName} ${profile.lastName || ''}`.trim();
    }
    return profile?.username || 'Pengguna S4RAS';
  };

  const getInitials = () => {
    if (profile?.firstName) {
      return (profile.firstName[0] + (profile.lastName?.[0] || '')).toUpperCase();
    }
    return (profile?.username?.[0] || 'U').toUpperCase();
  };

  const getValue = (key) => {
    if (key === 'name') return getFullName();
    if (key === 'username') return profile?.username || '-';
    if (key === 'email') return profile?.email || '-';
    return '-';
  };

  const role = profile?.attributes?.role?.[0] || 'Pengguna Portal';

  return (
    <Layout>
      <div className="akun-container">
        
        {/* Back Link Header */}
        <div className="akun-header-nav">
          <Link to="/home" className="back-link">
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
          <h2 className="page-title">Informasi Akun</h2>
        </div>

        {/* Profile Card Header */}
        <div className="akun-profile-hero card">
          <div className="akun-hero-avatar-wrapper">
            <div className="akun-avatar-circle">
              {getInitials()}
            </div>
            <span className="akun-badge">{role}</span>
          </div>
          
          <div className="akun-hero-info">
            <h3 className="akun-hero-name">{getFullName()}</h3>
            <p className="akun-hero-email">{profile?.email || 'email@domain.com'}</p>
          </div>
        </div>

        {/* Section Cards */}
        <section className="akun-detail-grid" aria-label="Detail Akun">
          {dataSections.map((section, idx) => (
            <div className="card detail-section-card" key={idx}>
              <div className="section-card-header">
                <h4>{section.title}</h4>
                <p>{section.subtitle}</p>
              </div>

              <div className="section-card-list">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <div className="section-list-item" key={itemIdx}>
                      <div className="item-left">
                        <div className="item-icon-box">
                          <Icon size={18} />
                        </div>
                        <div className="item-details">
                          <span className="item-label">{item.title}</span>
                          <span className="item-value">{getValue(item.valueKey)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

      </div>
    </Layout>
  );
}

export default Akun;
