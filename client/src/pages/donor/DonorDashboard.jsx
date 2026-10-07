import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  ShieldCheck,
  Award,
  AlertCircle,
  Calendar,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../services/api.js';
import { PriorityBadge } from '../../components/StatusBadge.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';
import { Button } from '../../components/common/Button.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';

export const DonorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const loadDonorData = async () => {
      setLoading(true);
      try {
        if (user) {
          const profileRes = await api.getDonorById(user.id);
          if (profileRes.success && profileRes.donor) {
            setAvailable(Boolean(profileRes.donor.available));
            setDonations(profileRes.donor.donations || []);
          }
        }
        const reqRes = await api.getRequests({ priority: 'Emergency' });
        if (reqRes.success) {
          setNearbyRequests(reqRes.requests?.slice(0, 4) || []);
        }
      } catch (err) {
        console.error('Error loading donor dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDonorData();
  }, [user]);

  const handleToggleAvailability = async () => {
    const newStatus = !available;
    setAvailable(newStatus);
    try {
      if (user) {
        await api.toggleDonorAvailability(user.id, newStatus);
        toast.success(
          `Your status updated to ${newStatus ? 'Available for Donation' : 'Unavailable'}`,
          'Status Changed'
        );
      }
    } catch {
      setAvailable(!newStatus);
      toast.error('Failed to update availability on server.', 'Network Error');
    }
  };

  const donorBloodGroup = user?.donorProfile?.blood_group || 'O+';

  return (
    <div className="space-y-6">
      {/* Top Welcome & Availability Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0a0f1d] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-red-500/30 shrink-0">
            {donorBloodGroup}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{user?.name || 'Rahul Kumar'}</h1>
              <span title="Verified Voluntary Donor">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" /> Vijayawada, AP
              </span>
              <span>•</span>
              <span>
                Blood Group: <strong className="text-white">{donorBloodGroup}</strong>
              </span>
            </p>
          </div>
        </div>

        {/* Live Availability Switch */}
        <div className="flex items-center gap-4 bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700/80">
          <div>
            <div className="text-xs font-bold text-slate-200">Donation Availability</div>
            <div
              className={`text-[11px] font-semibold ${
                available ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {available ? '🟢 Ready for Emergency Match' : '🔴 Currently Unavailable'}
            </div>
          </div>

          <button
            onClick={handleToggleAvailability}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              available
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
            }`}
          >
            {available ? 'Set Unavailable' : 'Set Available'}
          </button>
        </div>
      </div>

      {/* Stats Cards with Counting Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Lifetime Donations"
          value={5}
          icon={Heart}
          color="red"
          suffix=" times"
          trendLabel="Verified units"
        />
        <StatCard
          title="Lives Supported"
          value={15}
          icon={Award}
          color="emerald"
          suffix=" patients"
          trendLabel="3 lives per unit"
        />
        <StatCard
          title="Days Since Last Donation"
          value={87}
          icon={Calendar}
          color="amber"
          suffix=" days"
          trendLabel="Cooldown nearly cleared"
        />
        <StatCard
          title="Urgent Requests in City"
          value={nearbyRequests.length || 4}
          icon={AlertCircle}
          color="indigo"
          suffix=" urgent"
          trendLabel="Within 10 km radius"
        />
      </div>

      {/* Urgent Emergency Requests Nearby */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Urgent Blood Requisitions Nearby
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Trauma patients currently awaiting compatible donors in Vijayawada
            </p>
          </div>
          <Link
            to="/donor/requests"
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
          >
            View All Requests →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex flex-col justify-between space-y-3 hover-lift transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm shrink-0">
                    {req.blood_group}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {req.patient_name} ({req.units_required} units)
                    </h4>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.hospital_name}</span>
                    </div>
                  </div>
                </div>
                <PriorityBadge priority={req.priority} size="sm" />
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500">Required: {req.required_date}</span>
                <Link to={`/patient/requests/${req.id}`}>
                  <Button size="sm" variant="primary">
                    View & Volunteer
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
