import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hospital, PlusCircle, ShieldCheck, Droplet, Users, ArrowRight } from 'lucide-react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { PriorityBadge, StatusBadge } from '../../components/StatusBadge.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Card, CardHeader } from '../../components/common/Card.jsx';

export const HospitalDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState({
    'A+': 15,
    'A-': 4,
    'B+': 18,
    'B-': 5,
    'AB+': 8,
    'AB-': 2,
    'O+': 24,
    'O-': 6,
  });

  useEffect(() => {
    const loadHospitalData = async () => {
      try {
        const res = await api.getRequests({ city: 'Vijayawada' });
        if (res.success) {
          setRequests(res.requests || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadHospitalData();
  }, []);

  const totalUnits = Object.values(inventory).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0a0f1d] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-red-600/30 shrink-0">
            <Hospital className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">City Care Hospital</h1>
              <span title="Verified Trauma Center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Governorpet Medical Enclave, Vijayawada • Trauma & Emergency Ward Hotline: +91 866 2456789
            </p>
          </div>
        </div>

        <Link to="/emergency-request" className="shrink-0">
          <Button size="lg" variant="emergency" icon={PlusCircle} className="shadow-lg">
            Create Hospital Emergency Request
          </Button>
        </Link>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Blood Inventory in Reserve"
          value={totalUnits}
          icon={Droplet}
          color="red"
          suffix=" units"
          trendLabel="Cold storage verified"
        />
        <StatCard
          title="Ward Requisitions Pending"
          value={requests.length || 5}
          icon={Hospital}
          color="amber"
          suffix=" active"
          trendLabel="Trauma unit requests"
        />
        <StatCard
          title="Affiliated Donors in Region"
          value={48}
          icon={Users}
          color="emerald"
          suffix=" registered"
          trendLabel="Fast emergency response"
        />
      </div>

      {/* Hospital Blood Inventory Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
        <CardHeader
          title="Blood Bank Reserve & Cold Storage Status"
          subtitle="Real-time units available on premises for transfusion"
          action={
            <Link to="/hospital/profile">
              <Button size="sm" variant="outline">
                Manage Reserve
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {Object.entries(inventory).map(([bg, count]) => {
            const isLow = count < 5;
            return (
              <div
                key={bg}
                className={`p-3.5 rounded-2xl border text-center transition-all hover-lift ${
                  isLow
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs inline-flex items-center justify-center mb-1 shadow-sm">
                  {bg}
                </span>
                <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {count} Units
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    isLow ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isLow ? 'Low Reserve' : 'Adequate'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Hospital Blood Requests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Active Hospital Ward Blood Requests
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Current patient requisitions in trauma center
            </p>
          </div>
          <Link
            to="/hospital/requests"
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
          >
            Manage All →
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {requests.map((req) => (
            <div
              key={req.id}
              className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 p-3 rounded-2xl transition"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                  {req.blood_group}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                      {req.request_number}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Patient: {req.patient_name}
                    </span>
                    <PriorityBadge priority={req.priority} size="sm" />
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Required: <strong>{req.units_required} unit(s)</strong> • Date: {req.required_date} • Contact: {req.contact_number}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/patient/requests/${req.id}/matches`}>
                  <Button size="sm" variant="success">
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
          ))}
        </div>
      </div>
    </div>
  );
};
