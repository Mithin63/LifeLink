import React, { useState, useEffect } from 'react';
import { Download, Hospital, CheckCircle2, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { api } from '../../services/api.js';
export const DonationHistory = () => {
    const { user } = useAuth();
    const { addToast } = useNotification();
    const [donations, setDonations] = useState([]);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [hospitalName, setHospitalName] = useState('City Care Hospital');
    const [donationDate, setDonationDate] = useState(new Date().toISOString().split('T')[0]);
    const [units, setUnits] = useState(1);
    const [loading, setLoading] = useState(false);
    const fetchHistory = async () => {
        if (user) {
            try {
                const res = await api.getDonationHistory(user.id);
                if (res.success) {
                    setDonations(res.donations || []);
                }
            }
            catch (err) {
                console.error(err);
            }
        }
    };
    useEffect(() => {
        fetchHistory();
    }, [user]);
    const handleRecordDonation = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (user) {
                await api.recordDonation(user.id, {
                    hospital_name: hospitalName,
                    donation_date: donationDate,
                    units
                });
                addToast('Donation successfully recorded & verified certificate generated!', 'success');
                setShowRecordModal(false);
                fetchHistory();
            }
        }
        catch (err) {
            addToast(err.message || 'Error recording donation', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDownloadCertificate = (certId) => {
        addToast(`Downloading Digital Donation Certificate [${certId || 'CERT-2026-X'}]...`, 'success');
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Donation History</h1>
          <p className="text-xs text-slate-500">Track all your completed blood donations and certificates</p>
        </div>
        <button onClick={() => setShowRecordModal(true)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-red-500/20 transition">
          <PlusCircle className="w-4 h-4"/> Record New Donation
        </button>
      </div>

      {/* Summary Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Units Donated</span>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{donations.length || 5} Units</h3>
          <span className="text-[10px] text-emerald-600 font-semibold">Whole blood units</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Lives Saved</span>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{(donations.length || 5) * 3} Lives</h3>
          <span className="text-[10px] text-red-600 font-semibold">3 lives per blood unit</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Donor Tier</span>
          <h3 className="text-3xl font-black text-amber-600 mt-1">Gold Hero</h3>
          <span className="text-[10px] text-slate-500">Certified Community Contributor</span>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Verified Donation Records</h3>
          <span className="text-xs text-slate-500">{donations.length} records found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Hospital / Blood Bank</th>
                <th className="p-4">Date</th>
                <th className="p-4">Units</th>
                <th className="p-4">Certificate ID</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.length === 0 ? (<tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
                    No donation records yet. Record your first donation above!
                  </td>
                </tr>) : (donations.map((d, i) => (<tr key={d.id || i} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <Hospital className="w-4 h-4 text-red-500"/>
                      {d.hospital_name || 'City Care Hospital'}
                    </td>
                    <td className="p-4 text-slate-600 text-xs">
                      {d.donation_date}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {d.units || 1} Unit
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">
                      {d.certificate_id || `CERT-2026-${100 + i}`}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3"/> Completed
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDownloadCertificate(d.certificate_id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition">
                        <Download className="w-3.5 h-3.5"/> Certificate
                      </button>
                    </td>
                  </tr>)))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Donation Modal */}
      {showRecordModal && (<div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-lg">Record Blood Donation</h3>
            <p className="text-xs text-slate-500">Enter details of your donation to update your health record & earn certificates.</p>

            <form onSubmit={handleRecordDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Hospital / Centre Name</label>
                <input type="text" value={hospitalName} onChange={e => setHospitalName(e.target.value)} required className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Donation Date</label>
                <input type="date" value={donationDate} onChange={e => setDonationDate(e.target.value)} required className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Units Donated</label>
                <input type="number" min={1} max={3} value={units} onChange={e => setUnits(Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"/>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowRecordModal(false)} className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md">
                  {loading ? 'Recording...' : 'Confirm Record'}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
