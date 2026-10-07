import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Phone,
  Building2,
  Users,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { ProgressTracker } from '../../components/ProgressTracker.jsx';
import { PriorityBadge, StatusBadge } from '../../components/StatusBadge.jsx';
import { ContactDonorModal } from '../../components/ContactDonorModal.jsx';
import { SmartMatchModal } from '../../components/common/SmartMatchModal.jsx';
import { Button } from '../../components/common/Button.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';

export const RequestDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const [request, setRequest] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [smartMatchOpen, setSmartMatchOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchRequestDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.getRequestById(id);
      if (res.success && res.request) {
        setRequest(res.request);
        setMatches(res.matches || []);
      }
    } catch (err) {
      toast.error('Failed to load blood request details.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    if (!id) return;
    try {
      await api.updateRequestStatus(id, newStatus);
      toast.success(`Lifecycle status moved to: ${newStatus}`, 'Status Updated');
      fetchRequestDetails();
    } catch (err) {
      toast.error(err.message || 'Error updating status', 'Update Failed');
    }
  };

  const handleCopyId = () => {
    if (request?.request_number) {
      navigator.clipboard.writeText(request.request_number);
      setCopied(true);
      toast.info('Tracking ID copied to clipboard.', 'Copied');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContactMatch = (match) => {
    setSelectedDonor({
      ...match,
      name: match.donor_name || match.name,
      phone: match.donor_phone || match.phone,
    });
    setContactModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-sm font-semibold">Loading request tracking details...</span>
      </div>
    );
  }

  if (!request) {
    return (
      <EmptyState
        title="Blood Request Not Found"
        description="The requested blood emergency tracking ID does not exist or may have expired."
        actionLabel="Back to All Requests"
        onAction={() => (window.location.href = '/patient/requests')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/patient/requests"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Requests
        </Link>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            icon={Sparkles}
            onClick={() => setSmartMatchOpen(true)}
          >
            Run Smart Matching
          </Button>

          <Link to={`/patient/requests/${request.id}/matches`}>
            <Button size="sm" variant="primary" icon={Users}>
              View Matched Donors ({matches.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Request Tracking Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-red-500/30 shrink-0">
              {request.blood_group}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyId}
                  className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md hover:bg-slate-200 flex items-center gap-1 transition"
                  title="Click to copy Request ID"
                >
                  <span>{request.request_number}</span>
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
                <PriorityBadge priority={request.priority} />
                <StatusBadge status={request.status} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1.5">
                {request.units_required} unit(s) of {request.blood_group} blood for {request.patient_name}
              </h1>
            </div>
          </div>

          {/* Quick Status Update Selector for Staff / Attendant */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
              Update Status:
            </span>
            <select
              value={request.status}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="Request Created">1. Request Created</option>
              <option value="Donors Being Matched">2. Donors Being Matched</option>
              <option value="Donor Contacted">3. Donor Contacted</option>
              <option value="Donor Confirmed">4. Donor Confirmed</option>
              <option value="Blood Arranged">5. Blood Arranged</option>
              <option value="Completed">6. Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Visual 6-Stage Lifecycle Progress Tracker */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Request Lifecycle Timeline
          </h3>
          <ProgressTracker currentStatus={request.status} />
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
              <Building2 className="w-4 h-4 text-red-500" /> Hospital
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">
              {request.hospital_name}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {request.city || 'Vijayawada'}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
              <Calendar className="w-4 h-4 text-red-500" /> Required Date
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">
              {request.required_date}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {request.required_time || 'Immediate'}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
              <Phone className="w-4 h-4 text-red-500" /> Emergency Contact
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">
              {request.contact_number}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Attendant Verified
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
              <Users className="w-4 h-4 text-red-500" /> Matched Donors
            </div>
            <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-1">
              {matches.length} Candidates Found
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Sorted by score
            </div>
          </div>
        </div>

        {/* Reason / Clinical Notes */}
        {request.reason && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-100">Medical Notes: </span>
            {request.reason}
          </div>
        )}
      </div>

      {/* Top Suggested Donors Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Top Compatible Donors for this Request
          </h2>
          <Link
            to={`/patient/requests/${request.id}/matches`}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
          >
            View All ({matches.length}) →
          </Link>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.slice(0, 3).map((match, idx) => (
              <div
                key={match.id || idx}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle hover-lift flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {match.donor_name || match.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{match.donor_city || match.city || 'Nearby'} ({match.distance ? `${match.distance} km` : '2.3 km'})</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-red-600 text-white font-extrabold text-xs">
                      {match.blood_group || request.blood_group}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Compatibility:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      {match.compatibility_score || 95}% Match
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleContactMatch(match)}
                  className="w-full"
                >
                  Contact Donor
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-xs text-slate-500">No donor matches created yet.</p>
            <Button
              size="sm"
              variant="emergency"
              icon={Sparkles}
              onClick={() => setSmartMatchOpen(true)}
            >
              Trigger Smart Matching Now
            </Button>
          </div>
        )}
      </div>

      {/* Smart Match Modal */}
      <SmartMatchModal
        isOpen={smartMatchOpen}
        onClose={() => setSmartMatchOpen(false)}
        request={request}
        initialMatches={matches}
        onContactDonor={(donor) => {
          setSmartMatchOpen(false);
          handleContactMatch(donor);
        }}
        onViewAllMatches={() => {
          setSmartMatchOpen(false);
          window.location.href = `/patient/requests/${request.id}/matches`;
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
            fetchRequestDetails();
          }}
        />
      )}
    </div>
  );
};
