import React, { useState, useEffect } from 'react';
import { ShieldCheck, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { api } from '../../services/api.js';
export const DonorProfile = () => {
    const { user } = useAuth();
    const { addToast } = useNotification();
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [bloodGroup, setBloodGroup] = useState('O+');
    const [dob, setDob] = useState('1995-04-20');
    const [gender, setGender] = useState('Male');
    const [city, setCity] = useState('Vijayawada');
    const [state, setState] = useState('Andhra Pradesh');
    const [address, setAddress] = useState('MG Road, Benz Circle');
    const [lastDonationDate, setLastDonationDate] = useState('2026-07-10');
    const [available, setAvailable] = useState(true);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const res = await api.getDonorById(user.id);
                    if (res.success && res.donor) {
                        const d = res.donor;
                        setName(d.name || user.name);
                        setPhone(d.phone || user.phone);
                        setBloodGroup(d.blood_group || 'O+');
                        setDob(d.date_of_birth || '1995-04-20');
                        setGender(d.gender || 'Male');
                        setCity(d.city || 'Vijayawada');
                        setState(d.state || 'Andhra Pradesh');
                        setAddress(d.address || 'MG Road, Benz Circle');
                        setLastDonationDate(d.last_donation_date || '2026-07-10');
                        setAvailable(Boolean(d.available));
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
        };
        fetchProfile();
    }, [user]);
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (user) {
                await api.updateDonorProfile(user.id, {
                    name,
                    phone,
                    blood_group: bloodGroup,
                    date_of_birth: dob,
                    gender,
                    city,
                    state,
                    address,
                    last_donation_date: lastDonationDate,
                    available
                });
                addToast('Donor profile updated successfully!', 'success');
            }
        }
        catch (err) {
            addToast(err.message || 'Error updating profile', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Donor Profile</h1>
          <p className="text-xs text-slate-500">Manage your medical donor credentials and availability</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600"/>
          Verified Donor
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-red-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-red-600/30">
            {bloodGroup}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{name}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {available ? '🟢 Available for Emergencies' : '🔴 Currently Unavailable'}
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Blood Group
            </label>
            <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 bg-white">
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date of Birth
            </label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              City
            </label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Last Donation Date
            </label>
            <input type="date" value={lastDonationDate} onChange={e => setLastDonationDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500"/>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Address / Locality
            </label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. Ring Road, Benz Circle" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
          </div>
        </div>

        {/* Availability Switch */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-900 text-sm block">Live Donor Availability</span>
            <span className="text-xs text-slate-500">Allow patients and hospitals to match with you for urgent blood</span>
          </div>
          <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"/>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" disabled={loading} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md shadow-red-500/20 transition flex items-center gap-2">
            <Save className="w-4 h-4"/>
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>);
};
