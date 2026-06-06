// AccountPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useKeycloak } from '../context/KeycloakContext';
import Layout from '../components/Layout';
import './Akun.css';

const dataSections = [
  {
    title: 'Informasi pribadi',
    subtitle: 'Data yang umumnya ditampilkan di semua web myITS',
    items: [
      { icon: '🅰️', title: 'Nama', subtitle: 'Perbarui nama lengkap dan nama panggilan' },
      { icon: '📅', title: 'Tanggal Lahir', subtitle: 'Perbarui tanggal lahir' },
    ],
  },
  {
    title: 'Kontak',
    subtitle: 'Ubah email dan nomor ponsel',
    items: [
      { icon: '✉️', title: 'Email', subtitle: 'Perbarui dan verifikasi email' },
      { icon: '📞', title: 'Nomor Ponsel', subtitle: 'Perbarui dan verifikasi nomor telepon' },
    ],
  },
  {
    title: 'Lainnya',
    subtitle: 'Kata sandi dan preferensi tampilan',
    items: [
      { icon: '🔑', title: 'Keamanan Akun', subtitle: 'Atur kata sandi atau MFA' },
      { icon: '⚙️', title: 'Preferensi', subtitle: 'Sesuaikan tampilan dan preferensi Anda' },
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
      <div className="profile-panel">
        <div className="profile-card">
          <div className="profile-pic">
            <div className="profile-icon">👤</div>
          </div>
          <div className="profile-info">
            <div className="profile-name">{fullName}</div>
            <div className="profile-email">{email}</div>
            <div className="profile-role">{role}</div>
          </div>
        </div>
      </div>

      <section className="account-sections">
        {dataSections.map((section, index) => (
          <div className="section" key={index}>
            <h3>{section.title}</h3>
            <p className="section-subtitle">{section.subtitle}</p>
            {section.items.map((item, idx) => (
              <div className="section-item" key={idx}>
                <div className="item-left">
                  <div className="item-icon">{item.icon}</div>
                  <div className="item-text">
                    <div className="item-title">{item.title}</div>
                    <div className="item-subtitle">{item.subtitle}</div>
                  </div>
                </div>
                <div className="item-arrow">›</div>
              </div>
            ))}
          </div>
        ))}
      </section>

      <div className="actions-row">
        <Link to="/home" className="action-button">Kembali ke Beranda</Link>
        <Link to="/pengumuman" className="action-button">Lihat Pengumuman</Link>
      </div>
    </Layout>
  );
}

export default Akun;
