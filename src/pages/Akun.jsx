// Akun — Account Page
import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Calendar, Mail, Phone, KeyRound, Settings, ChevronRight, ArrowLeft } from 'lucide-react';
import { useKeycloak } from '../context/KeycloakContext';
import Layout from '../components/Layout';
import './Akun.css';

const dataSections = [
  {
    title: 'Informasi pribadi',
    subtitle: 'Data yang umumnya ditampilkan di semua layanan S4RAS',
    items: [
      { icon: UserCircle, title: 'Nama', subtitle: 'Perbarui nama lengkap dan nama panggilan' },
      { icon: Calendar, title: 'Tanggal Lahir', subtitle: 'Perbarui tanggal lahir' },
    ],
  },
  {
    title: 'Kontak',
    subtitle: 'Ubah email dan nomor ponsel',
    items: [
      { icon: Mail, title: 'Email', subtitle: 'Perbarui dan verifikasi email' },
      { icon: Phone, title: 'Nomor Ponsel', subtitle: 'Perbarui dan verifikasi nomor telepon' },
    ],
  },
  {
    title: 'Lainnya',
    subtitle: 'Kata sandi dan preferensi tampilan',
    items: [
      { icon: KeyRound, title: 'Keamanan Akun', subtitle: 'Atur kata sandi atau MFA' },
      { icon: Settings, title: 'Preferensi', subtitle: 'Sesuaikan tampilan dan preferensi Anda' },
    ],
  },
];

function Akun() {
  const { profile } = useKeycloak();
  const fullName = profile?.firstName || profile?.username || 'Pengguna S4RAS';
  const email = profile?.email || 'email@domain.com';
  const role = profile?.attributes?.role?.[0] || 'Anggota';

  return (
    <Layout>
      {/* Profile Header */}
      <div className="akun-profile-card card">
        <div className="akun-avatar" aria-hidden="true">
          {(fullName[0] || 'U').toUpperCase()}
        </div>
        <div className="akun-info">
          <h2 className="akun-name">{fullName}</h2>
          <div className="akun-email">{email}</div>
          <span className="akun-role-badge">{role}</span>
        </div>
      </div>

      {/* Settings Sections */}
      <section className="akun-sections" aria-label="Pengaturan akun">
        {dataSections.map((section, index) => (
          <div className="card akun-section" key={index}>
            <div className="akun-section-header">
              <h3>{section.title}</h3>
              <p className="akun-section-subtitle">{section.subtitle}</p>
            </div>
            {section.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  className="akun-item"
                  key={idx}
                  type="button"
                  aria-label={`${item.title}: ${item.subtitle}`}
                >
                  <div className="akun-item-left">
                    <div className="akun-item-icon">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div className="akun-item-text">
                      <div className="akun-item-title">{item.title}</div>
                      <div className="akun-item-subtitle">{item.subtitle}</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="akun-item-arrow" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        ))}
      </section>

      <div className="actions-row">
        <Link to="/home" className="action-button">
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali ke Beranda
        </Link>
      </div>
    </Layout>
  );
}

export default Akun;
