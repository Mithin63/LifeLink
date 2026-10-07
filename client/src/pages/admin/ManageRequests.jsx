import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge.jsx';
export const ManageRequests = () => {
    const { addToast } = useNotification();
    const [requests, setRequests] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await api.getRequests({ search: search.trim() || undefined });
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
    useEffect(() => {
        fetchRequests();
    }, []);
    const handleDelete = async (id, reqNum) => {
        if (!window.confirm(`Delete blood request ${reqNum}?`))
            return;
        try {
            await api.deleteRequest(id);
            addToast(`Request ${reqNum} deleted.`, 'success');
            fetchRequests();
        }
        catch (err) {
            addToast(err.message || 'Error deleting request', 'error');
        }
    };
    const handleStatusChange = async (id, status) => {
        try {
            await api.updateRequestStatus(id, status);
            addToast('Status updated successfully.', 'success');
            fetchRequests();
        }
        catch (err) {
            addToast(err.message || 'Error updating status', 'error');
        }
    };
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Manage Blood Requests</h1>
        <p className="text-xs text-slate-500">System-wide monitoring of all emergency and standard blood requisitions</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={e => { e.preventDefault(); fetchRequests(); }} className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Request ID, hospital, patient name..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-red-500"/>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Hospital</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Override Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {requests.map(req => (<tr key={req.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono font-bold text-slate-900">{req.request_number}</td>
                  <td className="p-4 font-semibold text-slate-900">{req.patient_name}</td>
                  <td className="p-4">
                    <span className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs inline-flex items-center justify-center">
                      {req.blood_group}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700">{req.hospital_name}</td>
                  <td className="p-4"><PriorityBadge priority={req.priority}/></td>
                  <td className="p-4"><StatusBadge status={req.status}/></td>
                  <td className="p-4">
                    <select value={req.status} onChange={e => handleStatusChange(req.id, e.target.value)} className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white">
                      <option value="Request Created">Request Created</option>
                      <option value="Donors Being Matched">Donors Being Matched</option>
                      <option value="Donor Contacted">Donor Contacted</option>
                      <option value="Donor Confirmed">Donor Confirmed</option>
                      <option value="Blood Arranged">Blood Arranged</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link to={`/patient/requests/${req.id}`} className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800">
                      Track
                    </Link>
                    <button onClick={() => handleDelete(req.id, req.request_number)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg" title="Delete">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
