import React from 'react';
import { Navbar } from '../../components/Navbar.jsx';
import { Footer } from '../../components/Footer.jsx';
import { ShieldCheck, Heart, Activity, CheckCircle2, Droplet, Users, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button.jsx';

export const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-slate-900 dark:bg-[#080c18] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
            About Our Platform
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            LifeLink
          </h1>
          <p className="text-red-400 font-bold text-lg sm:text-xl">
            Connecting Donors. Saving Lives. 🩸
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            LifeLink is an advanced full-stack blood donation and emergency request management platform developed to reduce turnaround times during critical medical emergencies.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 flex-1">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6 fill-red-100 dark:fill-red-950" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              To eliminate preventable deaths caused by blood shortages by building a transparent, hyper-local, real-time donor network that connects patients, hospitals, and voluntary donors seamlessly.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4 hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Our Vision</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              To digitize and modernize regional blood bank operations with algorithmic compatibility matching, GPS-assisted dispatch, and automated priority management for critical surgeries and trauma care.
            </p>
          </div>
        </div>

        {/* Safety & Medical Advisory Disclaimer */}
        <div className="p-8 rounded-3xl bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 space-y-4">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="text-lg font-bold">Medical Advisory & Verification Disclaimer</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            LifeLink provides technology matching algorithms based on reported blood types, geographical proximity, and donation intervals. LifeLink does NOT replace clinical screening, pathogen testing, or mandatory cross-matching performed by qualified medical professionals at certified hospital blood banks. Final clinical eligibility is verified at the donation center.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="space-y-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Core System Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                <Droplet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                GPS Haversine Proximity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Calculates precise distances between donor coordinates and trauma emergency wards for swift transit.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                100% Voluntary Network
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Built strictly to promote non-remunerated voluntary blood donation upholding international Red Cross ethics.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Hospital & Bank Integration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Direct integration with cold-storage inventory monitoring across regional medical enclaves.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
