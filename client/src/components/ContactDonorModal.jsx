import React, { useState } from 'react';
import { Phone, MapPin, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Modal } from './common/Modal.jsx';
import { Button } from './common/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const ContactDonorModal = ({ donor, isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [message, setMessage] = useState(
    `Hello ${donor?.name || 'Donor'}, we have an urgent blood requirement for blood group ${
      donor?.blood_group || 'O+'
    }. Could you please confirm your availability to donate?`
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);

    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success(
        `Alert dispatched to ${donor.name || 'Donor'}. They will confirm availability shortly.`,
        'Request Sent'
      );
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSent(false);
        onClose();
      }, 1500);
    }, 700);
  };

  if (!donor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
            {donor.blood_group}
          </div>
          <span>Contact Donor</span>
        </div>
      }
      subtitle="Direct Emergency Communication Channel"
      maxWidth="max-w-lg"
    >
      {sent ? (
        <div className="py-6 text-center space-y-3 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Alert Sent Successfully!
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            Donor <strong>{donor.name}</strong> has been notified via priority SMS & LifeLink in-app notification.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-4">
          {/* Donor Quick Details Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-slate-100">
              <span>{donor.name}</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                Available to Donate
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-3 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                {donor.city || 'Nearby'} ({donor.distance ? `${donor.distance} km` : '2.5 km'})
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {donor.phone ? donor.phone.replace(/.(?=.{4})/g, '•') : '+91 98••• ••21'}
              </span>
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Urgent Message to Donor
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
            />
          </div>

          {/* Privacy & Medical Advisory */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              Personal contact details are protected under LifeLink Medical Privacy guidelines. Donors respond directly with verification.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emergency"
              isLoading={sending}
              loadingText="Sending Alert..."
              icon={Send}
              className="flex-1"
            >
              Send Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
