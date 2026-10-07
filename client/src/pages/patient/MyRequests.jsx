import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ChevronRight } from 'lucide-react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { ProgressTracker } from '../../components/ProgressTracker.jsx';
export const MyRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await api.getRequests({
                status: statusFilter === 'All' ? undefined : statusFilter,
                search: search.trim() || undefined
            });
            if (res.success) {
                setRequests(res.requests || []);
                if (res.requests && res.requests.length > 0 && !selectedRequest) {
                    setSelectedRequest(res.requests[0]);
                }
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
    }, [statusFilter]);
    const handleSearch = (e) => {
        e.preventDefault();
        fetchRequests();
    };
    return (<div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Blood Requests</h1>
          <p className="text-xs text-slate-500">Track the live progress and donor matching status of your blood requests</p>
        </div>

        <Link to="/emergency-request" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-red-500/20 transition self-start sm:self-auto">
          <PlusCircle className="w-4 h-4"/>
          Create Request
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by request ID, patient, hospital..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-red-500 outline-none"/>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white flex-1 sm:flex-none">
            <option value="All">All Statuses</option>
            <option value="Request Created">Request Created</option>
            <option value="Donors Being Matched">Donors Being Matched</option>
            <option value="Donor Contacted">Donor Contacted</option>
            <option value="Donor Confirmed">Donor Confirmed</option>
            <option value="Blood Arranged">Blood Arranged</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Main Table (Matching Mockup 5 Layout) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Request ID</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Units</th>
                <th className="p-4">Hospital</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (<tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading requests...</td>
                </tr>) : requests.length === 0 ? (<tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No blood requests found.</td>
                </tr>) : (requests.map(req => {
            const isSelected = selectedRequest?.id === req.id;
            return (<tr key={req.id} onClick={() => setSelectedRequest(req)} className={`hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-red-50/40 font-semibold' : ''}`}>
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {req.request_number}
                      </td>
                      <td className="p-4">
                        <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-extrabold text-xs inline-flex items-center justify-center">
                          {req.blood_group}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        {req.units_required}
                      </td>
                      <td className="p-4 font-medium text-slate-800">
                        {req.hospital_name}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={req.status}/>
                      </td>
                      <td className="p-4 text-slate-500">
                        {req.required_date}
                      </td>
                      <td className="p-4 text-right">
                        <Link to={`/patient/requests/${req.id}`} className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-bold p-1 rounded-lg hover:bg-red-50">
                          <span>Track</span>
                          <ChevronRight className="w-4 h-4"/>
                        </Link>
                      </td>
                    </tr>);
        }))}
            </tbody>
          </table>
        </div>

        {/* Bottom Interactive Progress Tracker for Selected Row (Matching Mockup 5 bottom tracker) */}
        {selectedRequest && (<div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Live Lifecycle Tracker</span>
                <h4 className="text-sm font-bold text-slate-900">
                  Request {selectedRequest.request_number} ({selectedRequest.patient_name} • {selectedRequest.blood_group})
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/patient/requests/${selectedRequest.id}/matches`} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800">
                  View Matched Donors
                </Link>
                <Link to={`/patient/requests/${selectedRequest.id}`} className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700">
                  Full Details & Status Controls
                </Link>
              </div>
            </div>

            <ProgressTracker currentStatus={selectedRequest.status}/>
          </div>)}
      </div>
    </div>);
};
