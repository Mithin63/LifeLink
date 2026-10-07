import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, Mail, Lock, Eye, EyeOff, Sparkles, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Modal } from '../../components/common/Modal.jsx';

export const Login = () => {
  const { login, switchRoleForDemo } = useAuth();
  const { toast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      toast.warning('Please enter both email/phone and password.', 'Missing Credentials');
      return;
    }
    setLoading(true);
    try {
      const user = await login({ emailOrPhone, password });
      toast.success(`Welcome back, ${user.name}!`, 'Authentication Successful');
      switch (user.role) {
        case 'donor':
          navigate('/donor/dashboard');
          break;
        case 'hospital':
          navigate('/hospital/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/patient/dashboard');
          break;
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.', 'Invalid Login');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setLoading(true);
    try {
      await switchRoleForDemo(role);
      toast.success(`Authenticated into Demo ${role.toUpperCase()} account.`, 'Demo Access');
      if (role === 'donor') navigate('/donor/dashboard');
      else if (role === 'hospital') navigate('/hospital/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/patient/dashboard');
    } catch (err) {
      toast.error('Demo login error: ' + err.message, 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-medical-pattern flex flex-col justify-between transition-colors">
      {/* Top Navbar Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform">
            <Droplet className="w-5 h-5 fill-white" />
          </div>
          <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            Blood<span className="text-red-600">Connect</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <Link to="/" className="hover:text-red-600 dark:hover:text-red-400 transition">
            Home
          </Link>
          <Link to="/find-donors" className="hover:text-red-600 dark:hover:text-red-400 transition">
            Find Donors
          </Link>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-6 animate-slide-up">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in to your LifeLink healthcare account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email or Phone Number"
              type="text"
              icon={Mail}
              required
              placeholder="e.g., patient@bloodconnect.org"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="emergency"
              size="lg"
              isLoading={loading}
              loadingText="Verifying..."
              className="w-full mt-2"
            >
              Sign In to Account
            </Button>
          </form>

          {/* 1-Click Demo Logins */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 1-Click Demo Logins
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('patient')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-left text-xs font-bold text-slate-800 dark:text-slate-200 transition"
              >
                🔵 Patient View
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('donor')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-left text-xs font-bold text-slate-800 dark:text-slate-200 transition"
              >
                🔴 Donor View
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('hospital')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-left text-xs font-bold text-slate-800 dark:text-slate-200 transition"
              >
                🏥 Hospital View
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-left text-xs font-bold text-slate-800 dark:text-slate-200 transition"
              >
                🛡️ Admin View
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-red-600 dark:text-red-400 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Password"
        subtitle="We will dispatch a secure 6-digit recovery code to your verified email or phone."
        maxWidth="max-w-md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success(`Password reset link dispatched to ${forgotEmail}`, 'Recovery Email Sent');
            setForgotModalOpen(false);
          }}
          className="space-y-4"
        >
          <Input
            label="Email or Phone Number"
            type="text"
            required
            placeholder="e.g., patient@bloodconnect.org"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setForgotModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Send Reset Code
            </Button>
          </div>
        </form>
      </Modal>

      {/* Footer copyright */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/80 dark:border-slate-800">
        © 2026 LifeLink System • 24/7 Helpline: 1800-BLOOD-HELP
      </footer>
    </div>
  );
};
