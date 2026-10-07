import React, { useState } from 'react';
import { Save, ShieldCheck, Plus, Minus } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext.jsx';
export const HospitalProfile = () => {
    const { addToast } = useNotification();
    const [hospitalName, setHospitalName] = useState('City Care Hospital');
    const [phone, setPhone] = useState('+91 866 2456789');
    const [address, setAddress] = useState('MG Road, Governorpet');
    const [city, setCity] = useState('Vijayawada');
    const [state, setState] = useState('Andhra Pradesh');
    const [inventory, setInventory] = useState({
        'A+': 15, 'A-': 4, 'B+': 18, 'B-': 5, 'AB+': 8, 'AB-': 2, 'O+': 24, 'O-': 6
    });
    const updateUnits = (bg, delta) => {
        setInventory(prev => ({
            ...prev,
            [bg]: Math.max(0, (prev[bg] || 0) + delta)
        }));
    };
    const handleSave = (e) => {
        e.preventDefault();
        addToast('Hospital details and blood storage levels updated successfully!', 'success');
    };
    return (<div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Hospital Profile & Blood Bank</h1>
          <p className="text-xs text-slate-500">Manage hospital details and live inventory levels</p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600"/> Verified Medical Facility
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hospital Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Hospital Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Hospital Name</label>
              <input type="text" value={hospitalName} onChange={e => setHospitalName(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Emergency Hotline Phone</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">City</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
            </div>
          </div>
        </div>

        {/* Live Inventory Adjuster */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Blood Bank Stock Units</h3>
              <p className="text-xs text-slate-500">Increase or decrease units available in cold reserve</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(inventory).map(([bg, count]) => (<div key={bg} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-2">
                <span className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-red-500/20">
                  {bg}
                </span>
                <span className="text-xl font-black text-slate-900">{count} Units</span>
                <div className="flex items-center gap-2 pt-1">
                  <button type="button" onClick={() => updateUnits(bg, -1)} className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold flex items-center justify-center transition">
                    <Minus className="w-4 h-4"/>
                  </button>
                  <button type="button" onClick={() => updateUnits(bg, 1)} className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center transition">
                    <Plus className="w-4 h-4"/>
                  </button>
                </div>
              </div>))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md shadow-red-500/20 transition flex items-center gap-2">
            <Save className="w-4 h-4"/> Save Hospital Profile & Inventory
          </button>
        </div>
      </form>
    </div>);
};
