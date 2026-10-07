import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GitPullRequest,
  Heart,
  Building2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { api } from '../../services/api.js';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge.jsx';
import { StatCard } from '../../components/common/StatCard.jsx';
import { Card, CardHeader } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const AdminDashboard = () => {
  const { isDark } = useTheme();

  const [stats, setStats] = useState({
    totalDonors: 2548,
    activeDonors: 1890,
    totalRequests: 1380,
    activeRequests: 36,
    emergencyRequests: 8,
    completedRequests: 1245,
    registeredHospitals: 24,
    bloodBanks: 12,
    totalDonations: 1450,
    livesSaved: 4350,
  });

  const [charts, setCharts] = useState({
    bloodGroupDistribution: [
      { name: 'O+', value: 34, color: '#dc2626' },
      { name: 'A+', value: 26, color: '#e11d48' },
      { name: 'B+', value: 18, color: '#f43f5e' },
      { name: 'AB+', value: 12, color: '#fb7185' },
      { name: 'O-', value: 5, color: '#991b1b' },
      { name: 'Others', value: 5, color: '#64748b' },
    ],
    requestsByMonth: [
      { month: 'May', requests: 18, fulfilled: 15 },
      { month: 'Jun', requests: 24, fulfilled: 22 },
      { month: 'Jul', requests: 31, fulfilled: 28 },
      { month: 'Aug', requests: 29, fulfilled: 26 },
      { month: 'Sep', requests: 42, fulfilled: 38 },
      { month: 'Oct', requests: 48, fulfilled: 41 },
    ],
  });

  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const res = await api.getAdminStats();
        if (res.success) {
          if (res.stats) setStats(res.stats);
          if (res.charts) {
            const colors = [
              '#dc2626',
              '#e11d48',
              '#f43f5e',
              '#fb7185',
              '#f59e0b',
              '#3b82f6',
              '#10b981',
              '#64748b',
            ];
            const formattedBg = (res.charts.bloodGroupDistribution || []).map((b, idx) => ({
              name: b.blood_group || b.name,
              value: b.donors || b.percentage || 10,
              percentage: b.percentage,
              color: colors[idx % colors.length],
            }));
            setCharts({
              bloodGroupDistribution:
                formattedBg.length > 0 ? formattedBg : charts.bloodGroupDistribution,
              requestsByMonth: res.charts.requestsByMonth || charts.requestsByMonth,
            });
          }
          if (res.recentRequests) {
            setRecentRequests(res.recentRequests);
          }
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-1.5 border border-red-200 dark:border-red-900/40">
            <ShieldCheck className="w-3.5 h-3.5" /> System Analytics & Health Monitor
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Admin Management Console
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live overview of hospital blood requisitions, donor registrations, and smart matching throughput.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/reports">
            <Button size="sm" variant="outline">
              Export Audit Reports
            </Button>
          </Link>
          <Link to="/admin/requests">
            <Button size="sm" variant="emergency">
              Moderate Requests
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Stat Cards with Animated Number Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Donors"
          value={stats.totalDonors || 2548}
          icon={Users}
          color="red"
          trend={12}
          trendLabel="vs last month"
        />
        <StatCard
          title="Active Blood Requests"
          value={stats.activeRequests || 36}
          icon={GitPullRequest}
          color="amber"
          trend={-5}
          trendLabel="emergency triage"
        />
        <StatCard
          title="Lives Saved / Fulfilled"
          value={stats.livesSaved || 4350}
          icon={Heart}
          color="emerald"
          trend={18}
          trendLabel="transfusions completed"
        />
        <StatCard
          title="Partner Hospitals & Banks"
          value={(stats.registeredHospitals || 24) + (stats.bloodBanks || 12)}
          icon={Building2}
          color="indigo"
          trend={8}
          trendLabel="verified trauma units"
        />
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Requisitions vs Fulfilled Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
          <CardHeader
            title="Monthly Blood Requisitions vs Fulfilled Units"
            subtitle="Comparing patient demand vs successful donor fulfillment"
          />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.requestsByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  stroke={isDark ? '#64748b' : '#94a3b8'}
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke={isDark ? '#64748b' : '#94a3b8'}
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDark ? '#f8fafc' : '#0f172a',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="requests" name="Total Requests" fill="#e11d48" radius={[6, 6, 0, 0]} />
                <Bar dataKey="fulfilled" name="Units Fulfilled" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Group Inventory Distribution Donut */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-4">
          <CardHeader
            title="Blood Group Distribution"
            subtitle="Current proportion in registered donor pool"
          />
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.bloodGroupDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {charts.bloodGroupDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Blood Requests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Live Blood Requisitions Stream
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Recent requests submitted by attendants and partner trauma wards
            </p>
          </div>
          <Link
            to="/admin/requests"
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            Manage All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200/60 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-5">Request ID</th>
                <th className="py-3.5 px-5">Patient & Hospital</th>
                <th className="py-3.5 px-5">Blood Type</th>
                <th className="py-3.5 px-5">Units</th>
                <th className="py-3.5 px-5">Priority</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentRequests.length > 0 ? (
                recentRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-5 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {req.request_number}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {req.patient_name}
                      </div>
                      <div className="text-[11px] text-slate-500">{req.hospital_name}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-extrabold border border-red-200 dark:border-red-900/50">
                        {req.blood_group}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-200">
                      {req.units_required} unit(s)
                    </td>
                    <td className="py-4 px-5">
                      <PriorityBadge priority={req.priority} size="sm" />
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        to={`/patient/requests/${req.id}`}
                        className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No active requests in stream.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
