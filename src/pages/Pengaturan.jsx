import { useState, useEffect } from 'react';
import { Moon, Languages, Check, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
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

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.relative')) {
        setShowThemeDropdown(false);
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <h2 className="text-[1.75rem] font-semibold text-text-primary m-0">{t('set.title')}</h2>

        <div className="flex flex-col gap-6 flex-1">
          {/* Theme Settings Card */}
          <div className={`card flex flex-col gap-6 p-8 max-w-[800px] w-full hover:border-brand/20 hover:shadow-lg transition-all duration-200 relative ${showThemeDropdown ? 'z-20' : 'z-0'}`}>
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-bg3 text-brand-light flex-shrink-0">
                <Moon size={24} aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-text-primary mb-1">{t('set.theme_title')}</h3>
                <p className="text-sm text-text-secondary">{t('set.theme_desc')}</p>
              </div>
            </div>

            <div className="relative w-fit sm:ml-[4.5rem]">
              <button
                className="flex items-center justify-between gap-4 bg-neutral-bg3 border border-border-default rounded-lg px-5 py-3 text-text-primary text-sm font-medium cursor-pointer min-w-[200px] transition-all hover:bg-neutral-bg4 hover:border-border-strong focus-visible:outline-none focus-visible:border-brand-light focus-visible:shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                onClick={() => {
                  setShowThemeDropdown(!showThemeDropdown);
                  setShowLangDropdown(false);
                }}
                aria-expanded={showThemeDropdown}
                aria-haspopup="listbox"
              >
                <span>{theme === 'dark' ? t('set.theme.dark') : t('set.theme.light')}</span>
                <ChevronDown size={18} />
              </button>

              {showThemeDropdown && (
                <ul className="absolute top-[110%] left-0 z-50 min-w-[200px] bg-neutral-bg3 border border-border-default rounded-lg p-1 shadow-[0_10px_25px_rgba(0,0,0,0.45)] list-none m-0 animate-fade-in" role="listbox">
                  <li
                    className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer rounded-md transition-all ${theme === 'dark' ? 'text-brand-light bg-brand-subtle font-medium' : 'text-text-secondary hover:bg-neutral-bg4 hover:text-text-primary'}`}
                    onClick={() => toggleTheme('dark')}
                    role="option"
                    aria-selected={theme === 'dark'}
                  >
                    <span>{t('set.theme.dark')}</span>
                    {theme === 'dark' && <Check size={16} />}
                  </li>
                  <li
                    className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer rounded-md transition-all ${theme === 'light' ? 'text-brand-light bg-brand-subtle font-medium' : 'text-text-secondary hover:bg-neutral-bg4 hover:text-text-primary'}`}
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
          <div className={`card flex flex-col gap-6 p-8 max-w-[800px] w-full hover:border-brand/20 hover:shadow-lg transition-all duration-200 relative ${showLangDropdown ? 'z-10' : 'z-0'}`}>
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-bg3 text-brand-light flex-shrink-0">
                <Languages size={24} aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-text-primary mb-1">{t('set.lang_title')}</h3>
                <p className="text-sm text-text-secondary">{t('set.lang_desc')}</p>
              </div>
            </div>

            <div className="relative w-fit sm:ml-[4.5rem]">
              <button
                className="flex items-center justify-between gap-4 bg-neutral-bg3 border border-border-default rounded-lg px-5 py-3 text-text-primary text-sm font-medium cursor-pointer min-w-[200px] transition-all hover:bg-neutral-bg4 hover:border-border-strong focus-visible:outline-none focus-visible:border-brand-light focus-visible:shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                onClick={() => {
                  setShowLangDropdown(!showLangDropdown);
                  setShowThemeDropdown(false);
                }}
                aria-expanded={showLangDropdown}
                aria-haspopup="listbox"
              >
                <span>{language === 'id' ? t('set.lang.id') : t('set.lang.en')}</span>
                <ChevronDown size={18} />
              </button>

              {showLangDropdown && (
                <ul className="absolute top-[110%] left-0 z-50 min-w-[200px] bg-neutral-bg3 border border-border-default rounded-lg p-1 shadow-[0_10px_25px_rgba(0,0,0,0.45)] list-none m-0 animate-fade-in" role="listbox">
                  <li
                    className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer rounded-md transition-all ${language === 'id' ? 'text-brand-light bg-brand-subtle font-medium' : 'text-text-secondary hover:bg-neutral-bg4 hover:text-text-primary'}`}
                    onClick={() => toggleLang('id')}
                    role="option"
                    aria-selected={language === 'id'}
                  >
                    <span>{t('set.lang.id')}</span>
                    {language === 'id' && <Check size={16} />}
                  </li>
                  <li
                    className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer rounded-md transition-all ${language === 'en' ? 'text-brand-light bg-brand-subtle font-medium' : 'text-text-secondary hover:bg-neutral-bg4 hover:text-text-primary'}`}
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

        <footer className="mt-16 pt-6 border-t border-border-default flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-text-muted text-[0.8125rem]">
          <div className="footer-copyright">
            © 2026 Portal S4RAS. All rights reserved.
          </div>
          <div className="font-bold tracking-wider text-text-secondary flex items-center gap-2">
            <span>INTEGRITY & EXCELLENCE</span>
          </div>
        </footer>
      </div>
    </Layout>
  );
}

export default Pengaturan;
