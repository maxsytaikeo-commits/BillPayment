import { useState } from 'react';
import { IconLandmark, IconAlertTriangle, IconBarChart, IconAlertTriangle as IconMismatch, IconCreditCard } from './icons';
import { login } from '../api';

export default function Login({ lang, setLang, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError(lang === 'lo' ? 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ' : 'Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const user = await login(username, password);
      // ຄາດວ່າ Backend ຕອບ user object ຈາກ tb_users (username, fullname, userStatus, ...)
      onLogin(user);
    } catch (err) {
      if (err.message.includes('404')) {
        setError(lang === 'lo'
          ? 'ລະບົບ Login ຍັງບໍ່ພ້ອມ (Backend ຍັງບໍ່ມີ endpoint /api/auth/login)'
          : 'Login system not ready yet (Backend missing /api/auth/login)');
      } else {
        setError(lang === 'lo' ? 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ' : 'Invalid username or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: IconBarChart, text: lang === 'lo' ? 'ຕິດຕາມທຸລະກຳແບບ Real-time' : 'Real-time transaction monitoring' },
    { icon: IconMismatch, text: lang === 'lo' ? 'ຈັດການຄວາມຜິດພາດອັດຕະໂນມັດ' : 'Automated mismatch reconciliation' },
    { icon: IconCreditCard, text: lang === 'lo' ? 'ຈຳລອງການຊຳລະບິນຄົບວົງຈອນ' : 'End-to-end bill payment simulation' },
  ];

  return (
    <div className="min-h-screen w-full flex">
      {/* LEFT: Brand panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0f2942] text-white flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
              <IconLandmark size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm tracking-tight">BANKING CORE SYSTEM</p>
              <p className="text-[12px] text-slate-400">Bill Payment & Reconciliation Hub</p>
            </div>
          </div>
        </div>

        <div className="relative space-y-8 max-w-sm">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            {lang === 'lo'
              ? 'ຈັດການການຊຳລະບິນ ແລະ ການສະໜອງບັນຊີໃນທີ່ດຽວ'
              : 'Manage bill payments and reconciliation in one place'}
          </h1>

          <div className="space-y-5">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <f.icon size={16} />
                </div>
                <p className="text-[14px] text-slate-300">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-[12px] text-slate-500">
          © 2026 Banking Core System. All rights reserved.
        </div>
      </div>

      {/* RIGHT: Login form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden flex-col items-center gap-3 mb-8">
            <div className="h-11 w-11 rounded-lg bg-[#0f2942] flex items-center justify-center text-white">
              <IconLandmark size={20} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-base text-slate-900">BANKING CORE SYSTEM</p>
              <p className="text-[13px] text-slate-500">Bill Payment & Reconciliation Hub</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
              {lang === 'lo' ? 'ຍິນດີຕ້ອນຮັບກັບຄືນ' : 'Welcome back'}
            </h2>
            <p className="text-[14px] text-slate-500 mt-1.5">
              {lang === 'lo' ? 'ປ້ອນຂໍ້ມູນເພື່ອເຂົ້າໃຊ້ລະບົບ' : 'Enter your credentials to continue'}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] rounded-lg px-3.5 py-2.5 mb-5">
              <IconAlertTriangle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                {lang === 'lo' ? 'ຊື່ຜູ້ໃຊ້' : 'Username'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={lang === 'lo' ? 'ປ້ອນຊື່ຜູ້ໃຊ້' : 'Enter your username'}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0f2942]/10 focus:border-[#0f2942] transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[13px] font-medium text-slate-700">
                  {lang === 'lo' ? 'ລະຫັດຜ່ານ' : 'Password'}
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0f2942]/10 focus:border-[#0f2942] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0f2942] hover:bg-[#16304d] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm mt-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {loading
                ? (lang === 'lo' ? 'ກຳລັງກວດສອບ...' : 'Signing in...')
                : (lang === 'lo' ? 'ເຂົ້າສູ່ລະບົບ' : 'Sign in')}
            </button>
          </form>

          <div className="mt-6 p-4 bg-white border border-slate-200 rounded-lg space-y-1.5">
            <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wide mb-2">
              {lang === 'lo' ? 'ບັນຊີທົດລອງ (ຈາກ Database)' : 'Test accounts (from Database)'}
            </p>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500">admin</span>
              <span className="font-mono text-slate-700">1234567890</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500">john.doe</span>
              <span className="font-mono text-slate-700">0987654321</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500">jane.smith</span>
              <span className="font-mono text-slate-700">2233445566</span>
            </div>
          </div>

          <button
            onClick={() => setLang(lang === 'lo' ? 'en' : 'lo')}
            className="w-full text-center text-[13px] text-slate-500 hover:text-slate-800 mt-6 transition-colors"
          >
            {lang === 'lo' ? 'Switch to English' : 'ປ່ຽນເປັນພາສາລາວ'}
          </button>
        </div>
      </div>
    </div>
  );
}