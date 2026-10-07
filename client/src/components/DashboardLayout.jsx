import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Droplet,
  LayoutDashboard,
  Users,
  GitPullRequest,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Building2,
  FileBarChart,
  PlusCircle,
  Sparkles,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { NotificationDropdown } from './NotificationDropdown.jsx';

export const DashboardLayout = () => {
  const { user, logout, switchRoleForDemo } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  // Define sidebar navigation items per role
  const getNavItems = () => {
    const role = user?.role || 'patient';
    if (role === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Donors', path: '/admin/donors', icon: Heart },
        { name: 'Requests', path: '/admin/requests', icon: GitPullRequest },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Hospitals', path: '/admin/hospitals', icon: Building2 },
        { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
      ];
    }
    if (role === 'donor') {
      return [
        { name: 'Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
        { name: 'Find Donors', path: '/find-donors', icon: Users },
        { name: 'Requests', path: '/donor/requests', icon: GitPullRequest },
        { name: 'Donation History', path: '/donor/history', icon: Heart },
        { name: 'My Profile', path: '/donor/profile', icon: User },
      ];
    }
    if (role === 'hospital') {
      return [
        { name: 'Dashboard', path: '/hospital/dashboard', icon: LayoutDashboard },
        { name: 'Blood Requests', path: '/hospital/requests', icon: GitPullRequest },
        { name: 'Donor Matches', path: '/hospital/matches', icon: Heart },
        { name: 'Hospital Profile', path: '/hospital/profile', icon: Building2 },
      ];
    }
    // Default Patient
    return [
      { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
      { name: 'Find Donors', path: '/find-donors', icon: Users },
      { name: 'My Requests', path: '/patient/requests', icon: GitPullRequest },
      { name: 'Profile', path: '/donor/profile', icon: User },
    ];
  };

  const navItems = getNavItems();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/find-donors?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const rolesList = [
    { role: 'patient', label: 'Patient / Attendant', badge: 'Patient' },
    { role: 'donor', label: 'Blood Donor', badge: 'Donor' },
    { role: 'hospital', label: 'Hospital Admin', badge: 'Hospital' },
    { role: 'admin', label: 'System Admin', badge: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Dark Navy Healthcare Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0a0f1d] border-r border-slate-800/80 text-slate-300 flex flex-col justify-between shrink-0 shadow-2xl transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-500/30 group-hover:scale-105 transition-transform">
                <Droplet className="w-5 h-5 fill-white text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Life<span className="text-red-500">Link</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3.5 space-y-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Role Switcher & Logout */}
        <div className="p-3.5 border-t border-slate-800/80 space-y-2">
          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700/60 transition"
            >
              <span className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">
                  Role: <strong className="text-white capitalize">{user?.role || 'Patient'}</strong>
                </span>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {roleSwitcherOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#111827] border border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-1 z-50 animate-slide-up">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                  Switch Demo View
                </div>
                {rolesList.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRoleForDemo(r.role);
                      setRoleSwitcherOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                      user?.role === r.role
                        ? 'bg-red-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {r.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-slate-800/60 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-medical-pattern min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-subtle transition-colors">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Top Search Input */}
            <form onSubmit={handleSearch} className="relative w-full max-w-md hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search donors, blood requests, hospitals..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs border border-transparent focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition"
              />
            </form>
          </div>

          {/* Right Header Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Emergency Request Button */}
            <Link
              to="/emergency-request"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-sm shadow-red-600/30 btn-emergency-pulse transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New Request
            </Link>

            {/* Notification Bell */}
            <NotificationDropdown />

            {/* User Avatar Badge */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-red-600/20 shrink-0">
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()
                  : 'MD'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {user?.name || 'Mithin'}
                </div>
                <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  {user?.role || 'Patient'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Quick Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                  isActive
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
