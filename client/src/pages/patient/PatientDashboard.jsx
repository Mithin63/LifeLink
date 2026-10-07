import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, GitPullRequest, Users, AlertCircle, ChevronRight, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge.jsx';
import { ProgressTracker } from '../../components/ProgressTracker.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';
import { Button } from '../../components/common/Button.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const res = await api.getRequests();
        if (res.success) {
          setRequests(res.requests || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  const latestRequest = requests.length > 0 ? requests[0] : null;

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Create CTA */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
            Patient & Attendant Care Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {user?.name || 'Mithin'}
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
            Need emergency blood for a surgery or patient? Create a request to initiate instant AI-powered donor matching across nearby hospitals.
          </p>
        </div>

        <Link to="/emergency-request" className="shrink-0">
          <Button size="lg" variant="secondary" icon={PlusCircle} className="shadow-xl">
            Create Blood Request
          </Button>
        </Link>
      </div>

      {/* Quick Stats Grid with Count-up Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="My Total Requests"
          value={requests.length}
          icon={GitPullRequest}
          color="red"
          suffix=" logged"
          trendLabel="Active in system"
        />
        <StatCard
          title="Active Emergency Cases"
          value={requests.filter((r) => r.priority === 'Emergency' && r.status !== 'Completed').length}
          icon={AlertCircle}
          color="amber"
          suffix=" priority"
          trendLabel="Live triage"
        />
        <StatCard
          title="Compatible Donors Nearby"
          value={18}
          icon={Users}
          color="emerald"
          suffix=" available"
          trendLabel="Ready in Vijayawada"
        />
      </div>

      {/* Featured Active Request with Progress Tracker */}
      {latestRequest && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                  {latestRequest.request_number}
                </span>
                <PriorityBadge priority={latestRequest.priority} />
                <StatusBadge status={latestRequest.status} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                {latestRequest.units_required} unit(s) of {latestRequest.blood_group} blood for {latestRequest.patient_name}
              </h3>
            </div>

            <Link
              to={`/patient/requests/${latestRequest.id}`}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              View Full Timeline & Matches <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Visual Progress Tracker Widget */}
          <ProgressTracker currentStatus={latestRequest.status} />
        </div>
      )}

      {/* My Blood Requests List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Recent Blood Requisitions
          </h2>
          <Link
            to="/patient/requests"
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
          >
            Manage All Requests →
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {requests.length > 0 ? (
            requests.slice(0, 5).map((req) => (
              <div
                key={req.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 p-3 rounded-2xl transition"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-sm">
                    {req.blood_group}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                        {req.request_number}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {req.hospital_name}
                      </span>
                      <PriorityBadge priority={req.priority} size="sm" />
                      <StatusBadge status={req.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Patient: <strong>{req.patient_name}</strong> • Units:{' '}
                      <strong>{req.units_required}</strong> • Date: {req.required_date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/patient/requests/${req.id}/matches`}>
                    <Button size="sm" variant="primary">
                      Matched Donors
                    </Button>
                  </Link>
                  <Link to={`/patient/requests/${req.id}`}>
                    <Button size="sm" variant="outline">
                      Track Status
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No blood requests created yet"
              description="Create your first emergency blood request to initiate donor notifications."
              actionLabel="Create Blood Request"
              onAction={() => (window.location.href = '/emergency-request')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
