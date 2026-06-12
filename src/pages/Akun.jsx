// Akun — Account Page
import { UserCircle, Calendar, Mail } from 'lucide-react';
import { useKeycloak } from '../context/KeycloakContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import Layout from '../components/Layout';

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
      <div className="flex flex-col gap-6">

        {/* Page Title Header */}
        <h2 className="text-[1.75rem] font-semibold text-text-primary m-0">{t('account.title_info')}</h2>

        {/* Profile Card Header */}
        <div className="card relative flex flex-col sm:flex-row items-center gap-8 p-10 overflow-hidden bg-gradient-to-br from-neutral-bg2/50 to-neutral-bg1/70 light:from-white/90 light:to-gray-100/90">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-[250px] h-full bg-[radial-gradient(circle,rgba(239,68,68,0.1)_0%,transparent_70%)] pointer-events-none z-0" />

          <div className="relative flex-shrink-0 z-10">
            <div className="w-24 h-24 rounded-full bg-[radial-gradient(circle_at_top_left,#f87171_0%,#991b1b_100%)] text-white text-4xl font-bold flex items-center justify-center shadow-[0_4px_20px_rgba(185,28,28,0.3)] border-2 border-white/10">
              {getInitials()}
            </div>
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-brand text-white text-[0.6875rem] font-bold px-3 py-1 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.3)] border border-white/10 whitespace-nowrap">{role}</span>
          </div>

          <div className="flex flex-col gap-1.5 text-center sm:text-left z-10">
            <h3 className="text-2xl font-bold text-text-primary m-0">{getFullName()}</h3>
            <p className="text-sm text-text-secondary m-0">{profile?.email || 'email@domain.com'}</p>
          </div>
        </div>

        {/* Section Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6" aria-label={t('account.title_info')}>
          {dataSections.map((section, idx) => (
            <div className="card flex flex-col gap-6" key={idx}>
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-semibold text-text-primary m-0">{t(section.titleKey)}</h4>
                <p className="text-xs text-text-secondary m-0">{t(section.subtitleKey)}</p>
              </div>

              <div className="flex flex-col gap-3">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <div className="flex items-center justify-between p-4 bg-white/2 border border-border-default rounded-lg" key={itemIdx}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex items-center justify-center w-[38px] h-[38px] rounded-md bg-neutral-bg3 text-brand-light flex-shrink-0">
                          <Icon size={18} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs text-text-secondary">{t(item.titleKey)}</span>
                          <span className="text-sm font-semibold text-text-primary mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">{getValue(item.valueKey)}</span>
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
