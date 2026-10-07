import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
export const ManageHospitals = () => {
    const { addToast } = useNotification();
    const [hospitals, setHospitals] = useState([]);
    const [search, setSearch] = useState('');
    const fetchHospitals = async () => {
        try {
            const res = await api.getHospitals({ search: search.trim() || undefined });
            if (res.success) {
                setHospitals(res.hospitals || []);
            }
        }
        catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchHospitals();
    }, []);
    return (<div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Partner Hospitals</h1>
          <p className="text-xs text-slate-500">Certified healthcare institutions and regional blood banks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map(h => (<div key={h.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6"/>
              </div>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5"/> Verified
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base">{h.name}</h3>

            <div className="text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500"/>
                <span>{h.address}, {h.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400"/>
                <span className="font-mono text-slate-700 font-semibold">{h.phone}</span>
              </div>
            </div>
          </div>))}
      </div>
    </div>);
};
