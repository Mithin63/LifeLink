import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Droplet,
  Heart,
  User,
  Building2,
  Landmark,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input, Select } from '../../components/common/Input.jsx';
import { BloodGroupSelector } from '../../components/common/BloodGroupSelector.jsx';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'donor';

  const { register } = useAuth();
  const { toast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Common Profile Fields
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [dateOfBirth, setDateOfBirth] = useState('1998-05-15');
  const [gender, setGender] = useState('Male');
  const [city, setCity] = useState('Vijayawada');
  const [state, setState] = useState('Andhra Pradesh');
  const [address, setAddress] = useState('Ring Road Area');

  // Donor-specific fields
  const [lastDonationDate, setLastDonationDate] = useState('2026-06-15');
  const [available, setAvailable] = useState(true);
  const [eligibilityConfirmed, setEligibilityConfirmed] = useState(true);

  // Organization fields
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast.warning('Please fill all required mandatory fields.', 'Missing Information');
      return;
    }
    if (password !== confirmPassword) {
      toast.warning('Passwords do not match. Please verify.', 'Password Mismatch');
      return;
    }
    if (password.length < 6) {
      toast.warning('Password must be at least 6 characters.', 'Security Check');
      return;
    }
    if (role === 'donor' && !bloodGroup) {
      toast.warning('Please select your blood group.', 'Blood Group Required');
      return;
    }
    if (role === 'donor' && !eligibilityConfirmed) {
      toast.warning('Please confirm donation eligibility guidelines.', 'Health Standards');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name,
        email,
        phone,
        password,
        role,
        blood_group: bloodGroup || undefined,
        date_of_birth: dateOfBirth || undefined,
        gender: gender || undefined,
        city: city || 'Vijayawada',
        state: state || 'Andhra Pradesh',
        address: address || undefined,
        last_donation_date: lastDonationDate || undefined,
        available: available ? 1 : 0,
        hospital_name: role === 'hospital' ? orgName || name : undefined,
        bank_name: role === 'blood_bank' ? orgName || name : undefined,
      });

      toast.success(`Account created successfully! Welcome ${user.name}`, 'Registration Complete');
      if (role === 'donor') navigate('/donor/dashboard');
      else if (role === 'hospital') navigate('/hospital/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/patient/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed.', 'Registration Error');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'donor', title: 'Blood Donor', desc: 'Donate blood and track your life-saving impact', icon: Heart },
    { id: 'patient', title: 'Patient / Attendant', desc: 'Create emergency requests and match with donors', icon: User },
    { id: 'hospital', title: 'Hospital Admin', desc: 'Manage ward requirements and cold-storage units', icon: Building2 },
    { id: 'blood_bank', title: 'Blood Bank', desc: 'Track regional inventory reserves and distribution', icon: Landmark },
  ];

  return (
    <div className="min-h-screen bg-medical-pattern flex flex-col justify-between transition-colors">
      {/* Top Navbar */}
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
          <Link to="/login" className="hover:text-red-600 dark:hover:text-red-400 transition">
            Sign In
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

      {/* Main Registration Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-6 animate-slide-up">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Create Your Account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Join the LifeLink life-saving healthcare network
            </p>
          </div>

          {/* Role Selector Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Select Registration Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'border-red-600 bg-red-50/70 dark:bg-red-950/50 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-red-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {r.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                        {r.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                required
                placeholder="e.g., Sneha Reddy"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="sneha@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number (SMS & WhatsApp)"
                type="tel"
                required
                placeholder="+91 98480 11221"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {(role === 'hospital' || role === 'blood_bank') && (
                <Input
                  label="Hospital / Blood Bank Registered Name"
                  required
                  placeholder="e.g., City Care Hospital"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              )}

              {role === 'donor' && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <BloodGroupSelector
                    selected={bloodGroup}
                    onChange={setBloodGroup}
                    size="sm"
                  />
                </div>
              )}
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City / District"
                required
                placeholder="e.g., Vijayawada"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="State"
                required
                placeholder="e.g., Andhra Pradesh"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            {/* Donor Specific Settings */}
            {role === 'donor' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Live Donation Availability
                  </label>
                  <button
                    type="button"
                    onClick={() => setAvailable(!available)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                      available ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        available ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eligibilityConfirmed}
                    onChange={(e) => setEligibilityConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                  />
                  <span>
                    I confirm I am between 18-65 years old, weigh over 45 kg, and meet medical blood donation eligibility guidelines.
                  </span>
                </label>
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="emergency"
              size="lg"
              isLoading={loading}
              loadingText="Registering..."
              className="w-full mt-2"
            >
              Complete Registration
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Already have a LifeLink account?{' '}
            <Link to="/login" className="font-bold text-red-600 dark:text-red-400 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/80 dark:border-slate-800">
        © 2026 LifeLink System • Medical Privacy Standard Guaranteed
      </footer>
    </div>
  );
};
