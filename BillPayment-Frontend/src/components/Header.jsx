import { IconBarChart, IconAlertTriangle, IconCreditCard, IconGlobe } from './icons';

export default function Header({ t, lang, setLang, activeTab, setActiveTab, user, onLogout }) {
  // ປ່ຽນ role ໃຫ້ເປັນຕົວນ້ຍເພື່ອປ້ອງກັນ Case sensitive
  const userRole = user?.role?.toLowerCase() || 'customer';

  // ກຳນົດສິດ: staff ເຫັນທຸກເມນູ, customer ເຫັນແຕ່ payment
  const allNavItems = [
    { key: 'monitoring', label: t?.tabMonitoring ? t.tabMonitoring.replace(/^\S+\s/, '') : '', icon: IconBarChart, roles: ['staff'] },
    { key: 'mismatch', label: t?.tabMismatch ? t.tabMismatch.replace(/^\S+\s/, '') : '', icon: IconAlertTriangle, roles: ['staff'] },
    { key: 'payment', label: t?.tabPayment ? t.tabPayment.replace(/^\S+\s/, '') : '', icon: IconCreditCard, roles: ['customer', 'staff'] },
  ];

  // ກັ່ນກອງເອົາສະເພາະເມນູທີ່ Role ນັ້ນໆມີສິດເຫັນ
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/302196511_443485471142126_3273718904034624197_n.png"
              alt="Bill Payment logo"
              className="h-11 w-11 shrink-0 rounded-lg object-cover border border-slate-200 bg-white"
            />
            <div className="min-w-0 leading-tight">
              <p className="font-semibold text-base text-slate-900 truncate tracking-tight">{t?.appName}</p>
              <p className="text-[13px] text-slate-500 truncate">{t?.appSub}</p>
            </div>
          </div>

          {/* Desktop Nav */}
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
                  <span className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-[#1e3a5f] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {user && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                {userRole === 'staff' ? (lang === 'lo' ? 'ພະນັກງານ' : 'Staff') : (lang === 'lo' ? 'ລູກຄ້າ' : 'Customer')}
              </span>
            )}

            <button
              onClick={() => setLang(lang === 'lo' ? 'en' : 'lo')}
              className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-600 transition-colors"
            >
              <IconGlobe size={16} className="text-slate-400" />
              {lang === 'lo' ? 'EN' : 'LA'}
            </button>

            {user && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-sm font-medium text-slate-600 transition-colors"
                title={user.username}
              >
                {lang === 'lo' ? 'ອອກຈາກລະບົບ' : 'Logout'}
              </button>
            )}
          </div>
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
              {activeTab === key && <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#1e3a5f] rounded-full" />}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}