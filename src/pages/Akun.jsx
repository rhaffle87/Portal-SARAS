// Akun — Account Page
import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Calendar, Mail, ArrowLeft } from 'lucide-react';
import { useKeycloak } from '../context/KeycloakContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import Layout from '../components/Layout';
import './Akun.css';

const dataSections = [
  {
    titleKey: 'account.personal_info',
    subtitleKey: 'account.personal_desc',
    items: [
      { icon: UserCircle, titleKey: 'account.fullname', valueKey: 'name', subtitleKey: 'account.fullname_sub' },
      { icon: Calendar, titleKey: 'account.username', valueKey: 'username', subtitleKey: 'account.username_sub' },
    ],
  },
  {
    titleKey: 'account.contact_info',
    subtitleKey: 'account.contact_desc',
    items: [
      { icon: Mail, titleKey: 'account.email', valueKey: 'email', subtitleKey: 'account.email_sub' },
    ],
  },
];

function Akun() {
  const { profile } = useKeycloak();
  const { t } = useThemeLanguage();
  
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

  const role = profile?.attributes?.role?.[0] || t('account.user_portal');

  return (
    <Layout>
      <div className="akun-container">
        
        {/* Back Link Header */}
        <div className="akun-header-nav">
          <Link to="/home" className="back-link">
            <ArrowLeft size={16} />
            <span>{t('account.back')}</span>
          </Link>
          <h2 className="page-title">{t('account.title_info')}</h2>
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
        <section className="akun-detail-grid" aria-label={t('account.title_info')}>
          {dataSections.map((section, idx) => (
            <div className="card detail-section-card" key={idx}>
              <div className="section-card-header">
                <h4>{t(section.titleKey)}</h4>
                <p>{t(section.subtitleKey)}</p>
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
                          <span className="item-label">{t(item.titleKey)}</span>
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
