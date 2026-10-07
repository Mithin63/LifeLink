import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
export const ManageDonors = () => {
    const { addToast } = useNotification();
    const [donors, setDonors] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const fetchDonors = async () => {
        setLoading(true);
        try {
            const res = await api.getDonors({ search: search.trim() || undefined });
            if (res.success) {
                setDonors(res.donors || []);
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
        fetchDonors();
    }, []);
    const handleToggleVerify = async (donor) => {
        const newStatus = !donor.verified;
        try {
            await api.verifyDonor(donor.id, newStatus);
            addToast(`Donor ${donor.name} set to ${newStatus ? 'Verified' : 'Unverified'}`, 'success');
            setDonors(prev => prev.map(d => (d.id === donor.id ? { ...d, verified: newStatus } : d)));
        }
        catch (err) {
            addToast(err.message || 'Error updating verification', 'error');
        }
    };
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Manage Blood Donors</h1>
        <p className="text-xs text-slate-500">Review donor medical profiles, verification status, and availability</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={e => { e.preventDefault(); fetchDonors(); }} className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search donors by name, blood group, city..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-red-500"/>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Donor Name</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Location</th>
                <th className="p-4">Donations</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {donors.map(d => (<tr key={d.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 font-bold text-[10px] flex items-center justify-center">
                      {(d.name || 'D')[0]}
                    </div>
                    <span>{d.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs inline-flex items-center justify-center">
                      {d.blood_group}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{d.city}, AP</td>
                  <td className="p-4 font-semibold text-slate-800">{d.donation_count || 0} times</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${d.available ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {d.available ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${d.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {d.verified ? <ShieldCheck className="w-3.5 h-3.5"/> : <ShieldAlert className="w-3.5 h-3.5"/>}
                      {d.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleToggleVerify(d)} className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 rounded-lg text-xs">
                      {d.verified ? 'Revoke Verify' : 'Approve Verify'}
                    </button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
