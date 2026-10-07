import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  Heart,
  Users,
  Building2,
  Activity,
  HeartHandshake,
  Search,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar.jsx';
import { Footer } from '../../components/Footer.jsx';
import { Button } from '../../components/common/Button.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';
import { NeuralVascularTree } from '../../components/effects/NeuralVascularTree.jsx';
import { HeartbeatECGLine } from '../../components/effects/HeartbeatECGLine.jsx';
import { LiveNetworkMap } from '../../components/effects/LiveNetworkMap.jsx';

export const Home = () => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O+');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const bloodData = {
    'A+': { canGiveTo: 'A+, AB+', canReceiveFrom: 'A+, A-, O+, O-', rare: false },
    'A-': { canGiveTo: 'A+, A-, AB+, AB-', canReceiveFrom: 'A-, O-', rare: true },
    'B+': { canGiveTo: 'B+, AB+', canReceiveFrom: 'B+, B-, O+, O-', rare: false },
    'B-': { canGiveTo: 'B+, B-, AB+, AB-', canReceiveFrom: 'B-, O-', rare: true },
    'AB+': { canGiveTo: 'AB+ only', canReceiveFrom: 'Universal Recipient (All Groups)', rare: false },
    'AB-': { canGiveTo: 'AB+, AB-', canReceiveFrom: 'AB-, A-, B-, O-', rare: true },
    'O+': { canGiveTo: 'O+, A+, B+, AB+', canReceiveFrom: 'O+, O-', rare: false },
    'O-': { canGiveTo: 'Universal Donor (All Groups)', canReceiveFrom: 'O- only', rare: true },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />

      {/* Hero Section with Circuit/Vascular Connecting Animation (as in Video) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/60 via-white to-slate-50 dark:from-[#0a0f1d] dark:via-[#070b16] dark:to-[#070b16] pt-14 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 dark:border-slate-800">
        {/* Subtle Ambient Depth Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-rose-500/10 dark:bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fade-in relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/90 dark:bg-red-950/70 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider border border-red-200 dark:border-red-900/50 shadow-subtle">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                Live Donor & Emergency Healthcare Network
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                  <span className="relative inline-block">
                    Every Drop Can
                    {/* Clean Flowing ECG Heartbeat Waveform restricted strictly to the length of "Every Drop Can" */}
                    <HeartbeatECGLine className="absolute inset-x-0 -bottom-1 sm:bottom-0 h-[26px] sm:h-[32px] -z-10 pointer-events-none opacity-80 dark:opacity-90" />
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-red-500">
                    Save a Life
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                LifeLink brings voluntary donors, emergency patients, and hospitals together when every second matters. Fast, GPS-powered matching with hospital-verified blood units.
              </p>

              {/* Action Buttons with Tactile Click Physics */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/find-donors" className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" icon={Search} className="w-full sm:w-auto shadow-md">
                    Find a Donor Nearby
                  </Button>
                </Link>

                <Link to="/register?role=donor" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" icon={Heart} className="w-full sm:w-auto">
                    Become a Donor
                  </Button>
                </Link>
              </div>

              {/* Trust Metric Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-left">
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100 text-lg sm:text-xl">
                    Instant
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Smart Donor Match
                  </div>
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100 text-lg sm:text-xl">
                    100%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Verified Network
                  </div>
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100 text-lg sm:text-xl">
                    24 / 7
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Emergency Helpline
                  </div>
                </div>
              </div>
            </div>

            {/* Right Emergency Matcher Interactive Card with Clean Branching Vascular Tree Background & Glossy Shining Animation */}
            <div className="lg:col-span-5 flex justify-center items-center relative animate-slide-up">
              {/* Bio-Digital Vascular Circuit Tree neatly positioned behind the card without overlapping headline text */}
              <div className="hidden lg:block absolute -left-[160px] xl:-left-[200px] top-1/2 -translate-y-1/2 w-[520px] h-[420px] pointer-events-none z-0">
                <NeuralVascularTree className="w-full h-full opacity-75 dark:opacity-90 drop-shadow-[0_0_12px_rgba(239,68,68,0.35)]" />
              </div>

              {/* Ultra-Glossy Card with Diagonal Light Sweep & Specular Glare */}
              <div className="relative z-10 w-full max-w-md glass-glossy-card glow-border-pulse rounded-3xl p-6 sm:p-7 space-y-5 bg-[#0e1626]/90 dark:bg-[#0b1120]/95 backdrop-blur-xl border border-red-500/30 text-white shadow-2xl">
                {/* Static Top-Left Glass Specular Glare */}
                <div className="glass-specular-glare" />

                {/* Header Card Status */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center font-extrabold shadow-lg shadow-red-500/30 ring-1 ring-white/20">
                      <Droplet className="w-6 h-6 fill-white drop-shadow-sm" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base tracking-tight">
                        Emergency Matcher
                      </h4>
                      <p className="text-[11px] text-slate-300/80 font-medium">
                        Live Hospital Network
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm backdrop-blur-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active System
                  </span>
                </div>

                {/* Recipient Blood Group Selector with Tactile Glow Feedback */}
                <div className="space-y-2 relative z-10">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    SELECT RECIPIENT BLOOD GROUP:
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {bloodGroups.map((bg) => {
                      const isSelected = selectedBloodGroup === bg;
                      return (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setSelectedBloodGroup(bg)}
                          className={`group relative flex items-center justify-center py-2 px-1 rounded-xl border font-bold text-xs transition-all duration-150 ${
                            isSelected
                              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-400 shadow-lg shadow-red-600/40 scale-105 ring-2 ring-red-400/40 font-black'
                              : 'bg-slate-900/70 border-slate-700/80 text-slate-200 hover:border-red-400/60 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-0.5">
                            <Droplet
                              className={`w-3 h-3 ${
                                isSelected ? 'fill-white text-white' : 'text-red-500 fill-red-500/20'
                              }`}
                            />
                            <span className="text-xs">{bg}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Compatibility Info Card with Smooth Glass Background */}
                {selectedBloodGroup && bloodData[selectedBloodGroup] && (
                  <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-4 text-xs space-y-1.5 backdrop-blur-md relative z-10">
                    <div className="flex justify-between items-center pb-1">
                      <span className="font-bold text-red-200 text-sm">
                        Compatibility for {selectedBloodGroup}:
                      </span>
                      {bloodData[selectedBloodGroup].rare && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px]">
                          Rare Blood Type
                        </span>
                      )}
                    </div>
                    <div className="text-slate-300">
                      <strong className="text-slate-400">Can receive from:</strong>{' '}
                      <span className="text-red-300 font-semibold">
                        {bloodData[selectedBloodGroup].canReceiveFrom}
                      </span>
                    </div>
                    <div className="text-slate-300">
                      <strong className="text-slate-400">Can donate to:</strong>{' '}
                      <span className="text-white font-semibold">
                        {bloodData[selectedBloodGroup].canGiveTo}
                      </span>
                    </div>
                  </div>
                )}

                {/* Simulated Quick Match Preview CTA */}
                <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-700/80 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/30">
                      18
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        18 Donors Nearby
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Average response: 4 min
                      </div>
                    </div>
                  </div>
                  <Link to="/emergency-request">
                    <Button size="sm" variant="emergency" className="shadow-md shadow-red-600/30 font-bold">
                      Request Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Geospatial Map Section ("Connecting Donors Across Hospitals" from Video) */}
      <LiveNetworkMap />

      {/* Live Impact Statistics with Number Counter Animation */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Registered Donors"
              value={2548}
              icon={Users}
              color="red"
              trend={14}
              trendLabel="this month"
              suffix="+"
            />
            <StatCard
              title="Blood Requests Fulfilled"
              value={1380}
              icon={Activity}
              color="emerald"
              trend={8}
              trendLabel="completion rate 98%"
              suffix="+"
            />
            <StatCard
              title="Lives Supported"
              value={4350}
              icon={HeartHandshake}
              color="amber"
              trend={22}
              trendLabel="across AP state"
              suffix="+"
            />
            <StatCard
              title="Partner Hospitals"
              value={24}
              icon={Building2}
              color="indigo"
              trend={5}
              trendLabel="verified trauma units"
              suffix="+"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/80 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
            Streamlined Emergency Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How LifeLink Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-2">
            Four simple steps designed to rapidly connect patients with eligible blood donors when every minute counts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 text-left">
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card-hover transition-all hover-lift group">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-extrabold text-lg flex items-center justify-center mb-4 group-hover:scale-105 transition shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                Register Profile
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sign up as a voluntary blood donor, patient, hospital, or blood bank with verified medical credentials.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card-hover transition-all hover-lift group">
              <div className="w-12 h-12 rounded-xl bg-rose-600 text-white font-extrabold text-lg flex items-center justify-center mb-4 group-hover:scale-105 transition shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                Create Request
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Submit patient blood type, required units, hospital location, and urgency priority level.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card-hover transition-all hover-lift group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mb-4 group-hover:scale-105 transition shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                Smart Matching
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our algorithm calculates blood compatibility, GPS proximity, and donation intervals to rank optimal donors.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card-hover transition-all hover-lift group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center mb-4 group-hover:scale-105 transition shadow-sm">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                Dispatch & Delivery
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Hospital staff verifies blood units and completes transfusion with live 6-stage lifecycle tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency CTA Banner */}
      <section className="py-14 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Heart className="w-7 h-7 fill-white text-white animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Need Blood Urgently for an Emergency Surgery?
          </h2>
          <p className="text-sm sm:text-base text-red-100 mt-2 max-w-xl mx-auto">
            Create an emergency blood request now. Our AI engine will broadcast immediate notifications to verified donors in your hospital radius.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/emergency-request">
              <Button size="lg" variant="secondary" className="shadow-lg">
                Create Emergency Blood Request
              </Button>
            </Link>
            <a href="tel:18002566343">
              <Button size="lg" variant="outline" icon={PhoneCall} className="border-white/40 text-white hover:bg-white/10">
                Call 1800-BLOOD-HELP
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
