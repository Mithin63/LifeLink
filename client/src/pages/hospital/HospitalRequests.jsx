import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { api } from '../../services/api.js';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge.jsx';
export const HospitalRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchReqs = async () => {
            setLoading(true);
            try {
                const res = await api.getRequests();
                if (res.success) {
                    setRequests(res.requests || []);
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchReqs();
    }, []);
    return (<div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Hospital Blood Requests</h1>
          <p className="text-xs text-slate-500">Manage all patient blood requisitions and transfusion allocations</p>
        </div>

        <Link to="/emergency-request" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-red-500/20 transition self-start sm:self-auto">
          <PlusCircle className="w-4 h-4"/> New Requisition
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Request ID</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Units</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {requests.map(req => (<tr key={req.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono font-bold text-slate-900">{req.request_number}</td>
                  <td className="p-4 font-semibold text-slate-900">{req.patient_name}</td>
                  <td className="p-4">
                    <span className="w-7 h-7 rounded-lg bg-red-600 text-white font-extrabold text-xs inline-flex items-center justify-center">
                      {req.blood_group}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-800">{req.units_required}</td>
                  <td className="p-4"><PriorityBadge priority={req.priority}/></td>
                  <td className="p-4"><StatusBadge status={req.status}/></td>
                  <td className="p-4 text-right space-x-2">
                    <Link to={`/patient/requests/${req.id}/matches`} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs">
                      Matches
                    </Link>
                    <Link to={`/patient/requests/${req.id}`} className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs">
                      Details
                    </Link>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
