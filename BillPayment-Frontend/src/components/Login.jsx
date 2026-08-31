import { useState } from 'react';
import { IconLandmark, IconAlertTriangle } from './icons';

export default function Login({ lang, setLang, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError(lang === 'lo' ? 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ' : 'Please enter username and password');
      return;
    }

    setLoading(true);

    // TODO: ແທນທີ່ດ້ວຍການເອີ້ນ API ຈິງ ເມື່ອ Backend ພ້ອມ
    // ຕົວຢ່າງ: POST /api/login { username, password }
    // Backend ຄວນຕອບກັບ role ມາຈາກ tb_users.user_status (ເຊັ່ນ 'staff' ຫຼື 'customer')
    setTimeout(() => {
      setLoading(false);
      if (password === '1234') {
        // mock role check — ໃນລະບົບຈິງ role ຕ້ອງມາຈາກ Backend response
        const role = username.toLowerCase().includes('staff') ? 'staff' : 'customer';
        onLogin({ username, role });
      } else {
        setError(lang === 'lo' ? 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ' : 'Invalid username or password');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-lg bg-[#1e3a5f] flex items-center justify-center text-white">
            <IconLandmark size={22} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-base text-slate-900">BANKING CORE SYSTEM</p>
            <p className="text-[13px] text-slate-500">Bill Payment & Reconciliation Hub</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <h1 className="text-base font-semibold text-slate-900 mb-1">
            {lang === 'lo' ? 'ເຂົ້າສູ່ລະບົບ' : 'Sign in'}
          </h1>
          <p className="text-[13px] text-slate-500 mb-6">
            {lang === 'lo' ? 'ປ້ອນຂໍ້ມູນເພື່ອເຂົ້າໃຊ້ລະບົບ' : 'Enter your credentials to continue'}
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] rounded-lg px-3.5 py-2.5 mb-5">
              <IconAlertTriangle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                {lang === 'lo' ? 'ຊື່ຜູ້ໃຊ້' : 'Username'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={lang === 'lo' ? 'ປ້ອນຊື່ຜູ້ໃຊ້' : 'Enter username'}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                {lang === 'lo' ? 'ລະຫັດຜ່ານ' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e3a5f] hover:bg-[#16304d] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm"
            >
              {loading
                ? (lang === 'lo' ? 'ກຳລັງກວດສອບ...' : 'Signing in...')
                : (lang === 'lo' ? 'ເຂົ້າສູ່ລະບົບ' : 'Sign in')}
            </button>
          </form>

          <div className="text-[11px] text-slate-400 text-center mt-5 space-y-1">
            <p>{lang === 'lo' ? 'Demo ລູກຄ້າ: username ໃດກໍ່ໄດ້, password = 1234' : 'Demo customer: any username, password = 1234'}</p>
            <p>{lang === 'lo' ? 'Demo ພະນັກງານ: username ມີຄຳວ່າ "staff", password = 1234' : 'Demo staff: username contains "staff", password = 1234'}</p>
          </div>
        </div>

        <button
          onClick={() => setLang(lang === 'lo' ? 'en' : 'lo')}
          className="w-full text-center text-[13px] text-slate-500 hover:text-slate-800 mt-5"
        >
          {lang === 'lo' ? 'Switch to English' : 'ປ່ຽນເປັນພາສາລາວ'}
        </button>
      </div>
    </div>
  );
}