import React, { useState } from 'react';
import { Moon, Languages, Check, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import './Pengaturan.css';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

function Pengaturan() {
  const { theme, setTheme, language, setLanguage, t } = useThemeLanguage();
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
        <h2 className="page-title">{t('set.title')}</h2>

        <div className="settings-grid">
          {/* Theme Settings Card */}
          <div className="card settings-card">
            <div className="settings-card-header">
              <div className="settings-icon-wrapper">
                <Moon size={24} className="settings-icon" aria-hidden="true" />
              </div>
              <div className="settings-info">
                <h3>{t('set.theme_title')}</h3>
                <p>{t('set.theme_desc')}</p>
              </div>
            </div>
            
            <div className="dropdown-container">
              <button 
                className="dropdown-btn" 
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                aria-expanded={showThemeDropdown}
                aria-haspopup="listbox"
              >
                <span>{theme === 'dark' ? t('set.theme.dark') : t('set.theme.light')}</span>
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
                    <span>{t('set.theme.dark')}</span>
                    {theme === 'dark' && <Check size={16} />}
                  </li>
                  <li 
                    className={`dropdown-item ${theme === 'light' ? 'dropdown-item--active' : ''}`}
                    onClick={() => toggleTheme('light')}
                    role="option"
                    aria-selected={theme === 'light'}
                  >
                    <span>{t('set.theme.light')}</span>
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
                <h3>{t('set.lang_title')}</h3>
                <p>{t('set.lang_desc')}</p>
              </div>
            </div>
            
            <div className="dropdown-container">
              <button 
                className="dropdown-btn" 
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                aria-expanded={showLangDropdown}
                aria-haspopup="listbox"
              >
                <span>{language === 'id' ? t('set.lang.id') : t('set.lang.en')}</span>
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
                    <span>{t('set.lang.id')}</span>
                    {language === 'id' && <Check size={16} />}
                  </li>
                  <li 
                    className={`dropdown-item ${language === 'en' ? 'dropdown-item--active' : ''}`}
                    onClick={() => toggleLang('en')}
                    role="option"
                    aria-selected={language === 'en'}
                  >
                    <span>{t('set.lang.en')}</span>
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
