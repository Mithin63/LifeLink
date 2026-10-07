import React from 'react';
import { MapPin, Clock, Award, Phone, ShieldCheck, Heart } from 'lucide-react';
import { Button } from './common/Button.jsx';

export const DonorCard = ({ donor, onContact, showMatchScore = false, index = 0 }) => {
  const isAvailable = Boolean(donor.available !== false && donor.available !== 0);
  const isVerified = Boolean(donor.verified);

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card-hover dark:shadow-dark-card transition-all duration-200 p-5 flex flex-col justify-between group hover-lift animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div>
        {/* Top Header: Avatar, Name, Blood Group */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-base overflow-hidden shrink-0">
              {donor.avatar_url ? (
                <img
                  src={donor.avatar_url}
                  alt={donor.name || 'Donor'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {(donor.name || 'Donor')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition text-base leading-tight">
                  {donor.name || 'Anonymous Donor'}
                </h3>
                {isVerified && (
                  <span title="Verified & Screened Donor">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {donor.city || 'Nearby'}
                  {donor.state ? `, ${donor.state}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Blood Group Badge */}
          <div className="flex flex-col items-end">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-red-500/20 blood-drop-bounce">
              {donor.blood_group}
            </span>
          </div>
        </div>

        {/* Proximity & Distance */}
        <div className="flex items-center justify-between text-xs py-2.5 border-t border-b border-slate-100 dark:border-slate-800 my-3">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <strong className="text-slate-900 dark:text-slate-100">
              {donor.distance ? `${donor.distance} km` : '2.5 km'}
            </strong>{' '}
            away
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50'
                : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        {/* Donation Details & Last Donation */}
        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Last donation:
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {donor.last_donation_date ? donor.last_donation_date : '3 months ago'}
            </span>
          </div>

          {donor.donation_count !== undefined && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Total donations:
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {donor.donation_count} times
              </span>
            </div>
          )}

          {showMatchScore && donor.compatibility_score !== undefined && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Smart Match Score:
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                  {donor.compatibility_score}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${donor.compatibility_score}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Button
        size="sm"
        variant={isAvailable ? 'primary' : 'secondary'}
        onClick={() => onContact && onContact(donor)}
        disabled={!isAvailable}
        className="w-full"
        icon={Phone}
      >
        {isAvailable ? 'Contact Donor' : 'Currently Unavailable'}
      </Button>
    </div>
  );
};
