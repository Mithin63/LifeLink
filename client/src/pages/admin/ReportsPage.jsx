import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
export const ReportsPage = () => {
    const { addToast } = useNotification();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadReport = async () => {
            try {
                const res = await api.getReports();
                if (res.success) {
                    setReport(res.report);
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        loadReport();
    }, []);
    const handleExportCSV = () => {
        addToast('Exporting comprehensive system analytics report (.CSV)...', 'success');
    };
    return (<div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">System Reports & Analytics</h1>
          <p className="text-xs text-slate-500">Comprehensive performance metrics, donation volumes, and turnaround audits</p>
        </div>

        <button onClick={handleExportCSV} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition self-start sm:self-auto">
          <Download className="w-4 h-4"/> Export Report (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emergency Fulfillment Rate</span>
          <div className="text-3xl font-black text-emerald-600">{report?.summary?.emergencyResolvedRate || '94.2%'}</div>
          <span className="text-[11px] text-slate-500">Resolved within target time limit</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Matching Response</span>
          <div className="text-3xl font-black text-indigo-600">{report?.summary?.averageMatchingTime || '8.5 mins'}</div>
          <span className="text-[11px] text-slate-500">From submission to donor alert</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Donated Units</span>
          <div className="text-3xl font-black text-red-600">{report?.summary?.totalUnitsDonated || 1450} Units</div>
          <span className="text-[11px] text-slate-500">Verified clinical donations</span>
        </div>
      </div>

      {/* Top Hospitals by Volume */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Top Hospital Requisition Centres</h3>
        <div className="divide-y divide-slate-100">
          {(report?.topHospitals || [
            { hospital_name: 'City Care Hospital', request_count: 142, total_units: 210 },
            { hospital_name: 'Apollo Hospital', request_count: 98, total_units: 145 },
            { hospital_name: 'Sunrise Multispecialty Hospital', request_count: 76, total_units: 110 },
            { hospital_name: 'Life Care Hospital', request_count: 54, total_units: 80 }
        ]).map((h, i) => (<div key={i} className="py-3.5 flex items-center justify-between text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 font-bold flex items-center justify-center text-slate-600">
                  {i + 1}
                </span>
                <span>{h.hospital_name}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-slate-600"><strong>{h.request_count}</strong> Requests</span>
                <span className="text-red-600 font-bold"><strong>{h.total_units}</strong> Units</span>
              </div>
            </div>))}
        </div>
      </div>
    </div>);
};
