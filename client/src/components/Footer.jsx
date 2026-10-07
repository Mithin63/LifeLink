import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Phone, Mail, MapPin, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-[#080c18] text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-500/30 group-hover:scale-105 transition-transform">
                <Droplet className="w-6 h-6 fill-white text-white blood-drop-bounce" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                  Life<span className="text-red-500">Link</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Connecting Donors. Saving Lives. 🩸
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              LifeLink is a state-of-the-art medical donation platform bridging the critical gap between voluntary blood donors, emergency patients, partner hospitals, and regional blood banks.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Medical Privacy
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                <HeartHandshake className="w-3.5 h-3.5" /> Verified Donors
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-red-400 transition flex items-center gap-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/find-donors" className="hover:text-red-400 transition flex items-center gap-1">
                  Find Blood Donors
                </Link>
              </li>
              <li>
                <Link to="/emergency-request" className="hover:text-red-400 transition flex items-center gap-1 text-red-400 font-semibold">
                  Emergency Request
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-red-400 transition flex items-center gap-1">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-400 transition flex items-center gap-1">
                  About & Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Role Portals */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Role Portals</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/donor/dashboard" className="hover:text-red-400 transition">
                  Donor Portal
                </Link>
              </li>
              <li>
                <Link to="/patient/dashboard" className="hover:text-red-400 transition">
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link to="/hospital/dashboard" className="hover:text-red-400 transition">
                  Hospital Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-red-400 transition">
                  Admin Management
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-red-400 transition">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Support */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Emergency Support</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">1800-BLOOD-HELP</span>
                  <span className="text-xs text-slate-400">24/7 Emergency Dispatch</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">emergency@bloodconnect.org</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">Governorpet Medical Enclave, Vijayawada, AP</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 LifeLink System. Developed for Full Stack Healthcare Excellence.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Medical Advisory</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
