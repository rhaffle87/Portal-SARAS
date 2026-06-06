import React, { useState } from 'react';
import { Moon, Languages, Check, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import './Pengaturan.css';

function Pengaturan() {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('id');
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const toggleTheme = (val) => {
    setTheme(val);
    setShowThemeDropdown(false);
  };

  const toggleLang = (val) => {
    setLanguage(val);
    setShowLangDropdown(false);
  };

  return (
    <Layout>
      <div className="settings-page">
        <h2 className="page-title">Pengaturan Web</h2>

        <div className="settings-grid">
          {/* Theme Settings Card */}
          <div className="card settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-wrapper">
                <Moon size={24} className="settings-icon" aria-hidden="true" />
              </div>
              <div className="settings-info">
                <h3>Mode Tampilan</h3>
                <p>Pilih mode tampilan yang nyaman untuk Anda</p>
              </div>
            </div>
            
            <div className="dropdown-container">
              <button 
                className="dropdown-btn" 
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                aria-expanded={showThemeDropdown}
                aria-haspopup="listbox"
              >
                <span>{theme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}</span>
                <ChevronDown size={18} />
              </button>
              
              {showThemeDropdown && (
                <ul className="dropdown-menu" role="listbox">
                  <li 
                    className={`dropdown-item ${theme === 'dark' ? 'dropdown-item--active' : ''}`}
                    onClick={() => toggleTheme('dark')}
                    role="option"
                    aria-selected={theme === 'dark'}
                  >
                    <span>Mode Gelap</span>
                    {theme === 'dark' && <Check size={16} />}
                  </li>
                  <li 
                    className={`dropdown-item ${theme === 'light' ? 'dropdown-item--active' : ''}`}
                    onClick={() => toggleTheme('light')}
                    role="option"
                    aria-selected={theme === 'light'}
                  >
                    <span>Mode Terang</span>
                    {theme === 'light' && <Check size={16} />}
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Language Settings Card */}
          <div className="card settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-wrapper">
                <Languages size={24} className="settings-icon" aria-hidden="true" />
              </div>
              <div className="settings-info">
                <h3>Bahasa</h3>
                <p>Pilih bahasa yang Anda gunakan</p>
              </div>
            </div>
            
            <div className="dropdown-container">
              <button 
                className="dropdown-btn" 
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                aria-expanded={showLangDropdown}
                aria-haspopup="listbox"
              >
                <span>{language === 'id' ? 'Bahasa Indonesia' : 'English'}</span>
                <ChevronDown size={18} />
              </button>
              
              {showLangDropdown && (
                <ul className="dropdown-menu" role="listbox">
                  <li 
                    className={`dropdown-item ${language === 'id' ? 'dropdown-item--active' : ''}`}
                    onClick={() => toggleLang('id')}
                    role="option"
                    aria-selected={language === 'id'}
                  >
                    <span>Bahasa Indonesia</span>
                    {language === 'id' && <Check size={16} />}
                  </li>
                  <li 
                    className={`dropdown-item ${language === 'en' ? 'dropdown-item--active' : ''}`}
                    onClick={() => toggleLang('en')}
                    role="option"
                    aria-selected={language === 'en'}
                  >
                    <span>English</span>
                    {language === 'en' && <Check size={16} />}
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        <footer className="settings-footer">
          <div className="footer-copyright">
            © 2026 Portal S4RAS. All rights reserved.
          </div>
          <div className="footer-slogan">
            <span>INTEGRITY & EXCELLENCE</span>
          </div>
        </footer>
      </div>
    </Layout>
  );
}

export default Pengaturan;
