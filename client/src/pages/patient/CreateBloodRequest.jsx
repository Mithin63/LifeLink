import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Droplet,
  AlertCircle,
  Heart,
  Navigation,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  Calendar,
  Clock,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input, Select } from '../../components/common/Input.jsx';
import { BloodGroupSelector } from '../../components/common/BloodGroupSelector.jsx';
import { Modal } from '../../components/common/Modal.jsx';

export const CreateBloodRequest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState(user?.name || '');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [hospitalName, setHospitalName] = useState('City Care Hospital');
  const [hospitalAddress, setHospitalAddress] = useState('MG Road, Governorpet');
  const [city, setCity] = useState('Vijayawada');
  const [address, setAddress] = useState('Room 304, ICU Ward');
  const [userCoords, setUserCoords] = useState(null);
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [requiredTime, setRequiredTime] = useState('10:00 AM');
  const [priority, setPriority] = useState('Emergency');
  const [contactNumber, setContactNumber] = useState(user?.phone || '+91 9848011221');
  const [reason, setReason] = useState('Emergency surgery scheduled due to vehicular accident');
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Success Modal State
  const [createdRequest, setCreatedRequest] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast.warning('Geolocation is not supported by your browser.', 'GPS Note');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lon: longitude });
        setCity(city || 'Vijayawada');
        setGpsLoading(false);
        toast.success(
          `GPS Coordinates captured: [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`,
          'Location Detected'
        );
      },
      (err) => {
        setGpsLoading(false);
        toast.info('GPS access denied. You can enter hospital details manually.', 'Location Info');
      }
    );
  };

  const handleCopyId = () => {
    if (createdRequest?.request_number) {
      navigator.clipboard.writeText(createdRequest.request_number);
      setCopied(true);
      toast.info('Request ID copied to clipboard!', 'Copied');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bloodGroup) {
      toast.warning('Please select the required blood group.', 'Missing Information');
      return;
    }
    if (!hospitalName || !city || !contactNumber || !patientName) {
      toast.warning('Please fill in all mandatory patient and hospital details.', 'Required Fields');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createRequest({
        patient_name: patientName,
        blood_group: bloodGroup,
        units_required: Number(unitsRequired),
        hospital_name: hospitalName,
        hospital_address: hospitalAddress,
        city: city || 'Vijayawada',
        address: address,
        latitude: userCoords?.lat || 16.5062,
        longitude: userCoords?.lon || 80.648,
        required_date: requiredDate,
        required_time: requiredTime,
        priority: priority,
        reason: reason,
        contact_number: contactNumber,
      });

      if (res.success && res.request) {
        setCreatedRequest(res.request);
        toast.success(
          `Emergency Request ${res.request.request_number || res.request_number} logged in registry!`,
          'Request Created'
        );
      }
    } catch (err) {
      toast.error(err.message || 'Error creating blood request', 'Submission Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border border-red-200 dark:border-red-900/40">
          <Sparkles className="w-3.5 h-3.5" /> Emergency Dispatch
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Create Blood Request
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Submit patient and hospital details below. Our smart matching engine will immediately alert compatible voluntary donors and affiliated blood banks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Form Container */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Blood Group Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Required Blood Group <span className="text-red-500">*</span>
              </label>
              <BloodGroupSelector
                selected={bloodGroup}
                onChange={setBloodGroup}
                showDetails={true}
              />
            </div>

            {/* Units & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Units Required (Pints / Bags)"
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={unitsRequired}
                  onChange={(e) => setUnitsRequired(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Priority Urgency Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Normal', 'Urgent', 'Emergency'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                        priority === p
                          ? p === 'Emergency'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                            : p === 'Urgent'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p === 'Emergency' && '🚨 '}
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Patient Name & Contact Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Patient Full Name"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g., Harish Varma"
                />
              </div>
              <div>
                <Input
                  label="Contact Phone / WhatsApp"
                  icon={Phone}
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+91 98480 11221"
                />
              </div>
            </div>

            {/* Hospital & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Hospital / Clinic Name"
                  icon={Building2}
                  required
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="e.g., City Care Hospital"
                />
              </div>
              <div>
                <Input
                  label="City / District"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Vijayawada"
                />
              </div>
            </div>

            {/* Hospital Address & GPS Detect */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Hospital Address / Ward Details
                </label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={gpsLoading}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {gpsLoading ? 'Detecting...' : 'Auto-Fill Hospital GPS'}
                </button>
              </div>
              <Input
                value={hospitalAddress}
                onChange={(e) => setHospitalAddress(e.target.value)}
                placeholder="e.g., Governorpet MG Road, Room 304"
              />
            </div>

            {/* Required Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Required Date"
                  type="date"
                  required
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="Required Time"
                  type="text"
                  value={requiredTime}
                  onChange={(e) => setRequiredTime(e.target.value)}
                  placeholder="e.g., 10:00 AM / Immediately"
                />
              </div>
            </div>

            {/* Reason / Medical Notes */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Medical Reason / Notes for Donors
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="e.g., Emergency trauma surgery, platelets needed..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              />
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="emergency"
                size="lg"
                isLoading={loading}
                loadingText="Broadcasting Request..."
                icon={Heart}
                className="w-full text-base font-extrabold shadow-md"
              >
                Submit & Find Compatible Donors
              </Button>
            </div>
          </form>
        </div>

        {/* Right Info Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          {/* Emergency Advisory Card */}
          <div className="bg-red-50/90 dark:bg-red-950/40 rounded-3xl p-6 border border-red-200 dark:border-red-900/50 space-y-3">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-extrabold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Emergency Priority Protocol</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Requests marked as <strong>Emergency</strong> trigger high-priority push notifications to registered voluntary donors within a 15km radius of the selected hospital.
            </p>
            <div className="pt-2 border-t border-red-200 dark:border-red-900/40 text-[11px] text-slate-500 dark:text-slate-400">
              Verified clinical blood bank cross-matching is performed directly at hospital blood reception.
            </div>
          </div>

          {/* Helpline Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Need Immediate Phone Assistance?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Our 24/7 emergency dispatch coordinators can assist with regional blood bank reserves.
            </p>
            <a
              href="tel:18002566343"
              className="inline-flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
            >
              <Phone className="w-3.5 h-3.5" /> Call 1800-BLOOD-HELP (Toll Free)
            </a>
          </div>
        </div>
      </div>

      {/* Professional Request Created Success Modal (Section 10 of Prompt) */}
      <Modal
        isOpen={!!createdRequest}
        onClose={() => {
          const reqId = createdRequest?.id;
          setCreatedRequest(null);
          if (reqId) navigate(`/patient/requests/${reqId}`);
        }}
        maxWidth="max-w-md"
        showClose={false}
      >
        <div className="py-6 text-center space-y-4 animate-fade-in">
          {/* Animated Checkmark Circle */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Request Created Successfully!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your request is active and broadcasting to nearby compatible donors.
            </p>
          </div>

          {/* Request ID Display with Copy Button */}
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
            <div className="text-left">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Official Tracking ID
              </span>
              <span className="font-mono text-base font-extrabold text-red-600 dark:text-red-400">
                {createdRequest?.request_number || 'BR-2026-0001'}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              icon={copied ? Check : Copy}
              onClick={handleCopyId}
              className="text-xs"
            >
              {copied ? 'Copied' : 'Copy ID'}
            </Button>
          </div>

          {/* Quick Action Navigation */}
          <div className="pt-3 space-y-2">
            <Button
              variant="emergency"
              size="md"
              className="w-full"
              onClick={() => {
                const reqId = createdRequest?.id;
                setCreatedRequest(null);
                navigate(`/patient/requests/${reqId}/matches`);
              }}
              icon={Sparkles}
            >
              View Matched Donors Now
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-slate-500"
              onClick={() => {
                const reqId = createdRequest?.id;
                setCreatedRequest(null);
                navigate(`/patient/requests/${reqId}`);
              }}
            >
              Go to Request Tracking Timeline
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
