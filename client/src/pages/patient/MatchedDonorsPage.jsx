import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  AlertCircle,
  ShieldCheck,
  Phone,
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  Award,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { PriorityBadge } from '../../components/StatusBadge.jsx';
import { ContactDonorModal } from '../../components/ContactDonorModal.jsx';
import { SmartMatchModal } from '../../components/common/SmartMatchModal.jsx';
import { Button } from '../../components/common/Button.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';

export const MatchedDonorsPage = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const [request, setRequest] = useState(null);
  const [matches, setMatches] = useState([]);
  const [sortBy, setSortBy] = useState('score');
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [smartMatchOpen, setSmartMatchOpen] = useState(false);

  const fetchMatches = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.getRequestById(id);
      if (res.success && res.request) {
        setRequest(res.request);
        setMatches(res.matches || []);
      }
    } catch (err) {
      toast.error('Error loading matching donors.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [id]);

  const handleContactDonor = (match) => {
    setSelectedDonor({
      ...match,
      name: match.donor_name || match.name,
      phone: match.donor_phone || match.phone,
    });
    setContactModalOpen(true);
  };

  const sortedMatches = [...matches].sort((a, b) => {
    if (sortBy === 'distance') {
      return (a.distance || 0) - (b.distance || 0);
    }
    return (b.compatibility_score || 0) - (a.compatibility_score || 0);
  });

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-sm font-semibold">Calculating compatible donor rankings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Re-match Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/patient/requests/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Request Timeline
        </Link>

        <Button
          size="sm"
          variant="emergency"
          icon={Sparkles}
          onClick={() => setSmartMatchOpen(true)}
        >
          Re-Run Smart Matching
        </Button>
      </div>

      {/* Header & Request Meta Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                Matching Donors for Request #{request?.request_number || 'BR-2026-0001'}
              </h1>
              {request && <PriorityBadge priority={request.priority} />}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Multi-factor algorithm computed based on ABO & Rh compatibility, live availability, 90-day cooldown, and GPS distance.
            </p>
          </div>
        </div>

        {/* Top Info Grid Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1 border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
              Blood Group
            </span>
            <div className="font-extrabold text-red-600 dark:text-red-400 text-base">
              {request?.blood_group || 'A+'}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1 border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
              Units Required
            </span>
            <div className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
              {request?.units_required || 2} pint(s)
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1 border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
              Hospital
            </span>
            <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm truncate">
              {request?.hospital_name || 'City Care Hospital'}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1 border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
              Location
            </span>
            <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
              {request?.city || 'Vijayawada'}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1 col-span-2 sm:col-span-1 border border-slate-200/60 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px]">
              Required Date
            </span>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">
              {request?.required_date || 'Oct 5, 2026'}
            </div>
          </div>
        </div>
      </div>

      {/* Sort & Filter Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Ranked Compatible Donors ({sortedMatches.length})
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            <option value="score">Compatibility Score (Highest)</option>
            <option value="distance">Proximity (Nearest First)</option>
          </select>
        </div>
      </div>

      {/* Donors List */}
      {sortedMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedMatches.map((match, idx) => (
            <div
              key={match.id || idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-subtle hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between hover-lift animate-fade-in"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-sm shrink-0">
                      {(match.donor_name || match.name || 'Donor')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {match.donor_name || match.name || 'Verified Donor'}
                        </h4>
                        <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {match.donor_city || match.city || 'Nearby'} (
                          {match.distance ? `${match.distance} km` : '2.3 km'})
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="w-9 h-9 rounded-xl bg-red-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                    {match.blood_group || request?.blood_group}
                  </span>
                </div>

                {/* Match Score Bar */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Smart Match Compatibility
                    </span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      {match.compatibility_score || 95}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${match.compatibility_score || 95}%` }}
                    />
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                variant="primary"
                icon={Phone}
                onClick={() => handleContactDonor(match)}
                className="w-full"
              >
                Contact Donor
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Matching Donors Found Yet"
          description="Click 'Re-Run Smart Matching' to query all registered blood donors and nearby blood banks for this request."
          actionLabel="Run Smart Matching"
          onAction={() => setSmartMatchOpen(true)}
        />
      )}

      {/* Smart Match Simulation Modal */}
      <SmartMatchModal
        isOpen={smartMatchOpen}
        onClose={() => setSmartMatchOpen(false)}
        request={request}
        initialMatches={matches}
        onContactDonor={(donor) => {
          setSmartMatchOpen(false);
          handleContactDonor(donor);
        }}
      />

      {/* Contact Donor Modal */}
      {selectedDonor && (
        <ContactDonorModal
          donor={selectedDonor}
          isOpen={contactModalOpen}
          onClose={() => {
            setContactModalOpen(false);
            setSelectedDonor(null);
          }}
          onSuccess={() => {
            fetchMatches();
          }}
        />
      )}
    </div>
  );
};
