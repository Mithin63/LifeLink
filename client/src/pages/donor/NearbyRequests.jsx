import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { PriorityBadge, StatusBadge } from '../../components/StatusBadge.jsx';
export const NearbyRequests = () => {
    const { user } = useAuth();
    const { addToast } = useNotification();
    const [requests, setRequests] = useState([]);
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await api.getRequests({
                priority: priorityFilter === 'All' ? undefined : priorityFilter
            });
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
    }, [priorityFilter]);
    const handleRespond = (req) => {
        addToast(`You have marked interest for request ${req.request_number} at ${req.hospital_name}!`, 'success');
    };
    return (<div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Nearby Blood Requests</h1>
          <p className="text-xs text-slate-500">Live emergency requests seeking compatible blood donors</p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Priority:</span>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white">
            <option value="All">All Priorities</option>
            <option value="Emergency">Emergency Only</option>
            <option value="Urgent">Urgent Only</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
      </div>

      {loading ? (<div className="space-y-4">
          {[1, 2, 3].map(n => (<div key={n} className="h-28 bg-slate-200 animate-pulse rounded-2xl"/>))}
        </div>) : requests.length === 0 ? (<div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto"/>
          <h3 className="text-lg font-bold text-slate-800">No Active Requests</h3>
          <p className="text-xs text-slate-500">There are no pending blood requests matching your current filter.</p>
        </div>) : (<div className="grid grid-cols-1 gap-4">
          {requests.map(req => (<div key={req.id} className={`p-6 bg-white rounded-3xl border transition shadow-sm hover:shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${req.priority === 'Emergency' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'}`}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md shadow-red-600/30">
                  {req.blood_group}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-500">{req.request_number}</span>
                    <h3 className="text-base font-bold text-slate-900">{req.hospital_name}</h3>
                    <PriorityBadge priority={req.priority}/>
                    <StatusBadge status={req.status}/>
                  </div>

                  <p className="text-xs text-slate-600">
                    Patient: <strong>{req.patient_name}</strong> • Units Required: <strong>{req.units_required} unit(s)</strong>
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500"/>
                      {req.city} ({req.hospital_address || 'Hospital Road'})
                    </span>
                    <span>•</span>
                    <span>Date: {req.required_date} ({req.required_time || 'Immediate'})</span>
                  </div>

                  {req.reason && (<p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg mt-2">
                      "{req.reason}"
                    </p>)}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button onClick={() => handleRespond(req)} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/20 transition whitespace-nowrap">
                  Respond & Donate
                </button>
                <Link to={`/patient/requests/${req.id}`} className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl text-center whitespace-nowrap">
                  View Details
                </Link>
              </div>
            </div>))}
        </div>)}
    </div>);
};
