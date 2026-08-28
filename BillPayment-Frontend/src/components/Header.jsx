import { IconLandmark, IconBarChart, IconAlertTriangle, IconCreditCard, IconGlobe } from './icons';

export default function Header({ t, lang, setLang, activeTab, setActiveTab }) {
  const navItems = [
    { key: 'monitoring', label: t.tabMonitoring.replace(/^\S+\s/, ''), icon: IconBarChart },
    { key: 'mismatch', label: t.tabMismatch.replace(/^\S+\s/, ''), icon: IconAlertTriangle },
    { key: 'payment', label: t.tabPayment.replace(/^\S+\s/, ''), icon: IconCreditCard },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 shrink-0 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <IconLandmark size={20} />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="font-semibold text-base text-slate-900 truncate tracking-tight">{t.appName}</p>
              <p className="text-[13px] text-slate-500 truncate">{t.appSub}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center h-full gap-1">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative flex items-center gap-2 px-4 h-20 text-sm font-medium transition-colors ${
                  activeTab === key ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={19} className={activeTab === key ? 'text-slate-900' : 'text-slate-400'} />
                {label}
                {activeTab === key && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-slate-900 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setLang(lang === 'lo' ? 'en' : 'lo')}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-600 transition-colors shrink-0"
          >
            <IconGlobe size={16} className="text-slate-400" />
            {lang === 'lo' ? 'EN' : 'LA'}
          </button>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex border-t border-slate-100 -mx-6 px-6">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 py-3 text-[12px] font-medium ${
                activeTab === key ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              <Icon size={16} />
              {label}
              {activeTab === key && <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-slate-900 rounded-full" />}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}