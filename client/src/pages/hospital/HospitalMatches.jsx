import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { api } from '../../services/api.js';
import { ContactDonorModal } from '../../components/ContactDonorModal.jsx';
export const HospitalMatches = () => {
    const [donors, setDonors] = useState([]);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const res = await api.getDonors({ available: 'true' });
                if (res.success) {
                    setDonors(res.donors || []);
                }
            }
            catch (err) {
                console.error(err);
            }
        };
        fetchDonors();
    }, []);
    const handleContact = (donor) => {
        setSelectedDonor(donor);
        setModalOpen(true);
    };
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Hospital Donor Directory</h1>
        <p className="text-xs text-slate-500">Contact verified available donors for urgent hospital requirements</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {donors.map(d => (<div key={d.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 font-bold text-xs flex items-center justify-center">
                    {(d.name || 'D')[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{d.name}</h3>
                    <span className="text-xs text-slate-500">{d.city}, AP</span>
                  </div>
                </div>
                <span className="w-9 h-9 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center">
                  {d.blood_group}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <strong className="text-slate-800">{d.distance ? `${d.distance} km` : '3.2 km'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-600 font-bold">Available Now</span>
                </div>
              </div>
            </div>

            <button onClick={() => handleContact(d)} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm">
              <Phone className="w-3.5 h-3.5"/> Call / Contact Donor
            </button>
          </div>))}
      </div>

      <ContactDonorModal donor={selectedDonor} isOpen={modalOpen} onClose={() => setModalOpen(false)}/>
    </div>);
};
