import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

const STAGES = [
  { key: 'Request Created', label: 'Request Created', desc: 'Verified in system' },
  { key: 'Donors Being Matched', label: 'Donor Matching', desc: 'AI algorithm matching' },
  { key: 'Donor Contacted', label: 'Donor Contacted', desc: 'Hospital / attendant outreach' },
  { key: 'Donor Confirmed', label: 'Donor Confirmed', desc: 'Donor accepted' },
  { key: 'Blood Arranged', label: 'Blood Arranged', desc: 'Screening & dispatch' },
  { key: 'Completed', label: 'Completed', desc: 'Delivered to patient' },
];

export const ProgressTracker = ({ currentStatus }) => {
  const isCancelled = currentStatus === 'Cancelled';

  const getStageIndex = (status) => {
    switch (status) {
      case 'Request Created':
        return 0;
      case 'Donors Being Matched':
        return 1;
      case 'Donor Contacted':
        return 2;
      case 'Donor Confirmed':
        return 3;
      case 'Blood Arranged':
        return 4;
      case 'Completed':
        return 5;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  if (isCancelled) {
    return (
      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-3 text-rose-700 dark:text-rose-300">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <span className="text-sm font-semibold">
          This blood request has been <strong>Cancelled</strong> by the requester or hospital.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      {/* Desktop / Tablet Horizontal Stepper */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between">
          {/* Connecting Background Line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 dark:bg-slate-800 -z-0 rounded-full" />

          {/* Animated Completed Line */}
          <div
            className="absolute top-5 left-6 h-1 bg-gradient-to-r from-red-600 to-rose-500 -z-0 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(Math.max(0, currentIndex) / (STAGES.length - 1)) * 100}%`,
            }}
          />

          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;

            return (
              <div
                key={stage.key}
                className="relative z-10 flex flex-col items-center group text-center max-w-[100px]"
              >
                {/* Circle Indicator */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm ${
                    isCompleted
                      ? 'bg-red-600 text-white shadow-red-600/30'
                      : isCurrent
                      ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 border-2 border-red-600 dark:border-red-500 shadow-emergency animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 dark:bg-red-500 animate-ping" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Stage Text */}
                <div className="mt-2.5">
                  <span
                    className={`block text-xs font-bold leading-tight transition-colors ${
                      isCurrent
                        ? 'text-red-600 dark:text-red-400 font-extrabold'
                        : isCompleted
                        ? 'text-slate-900 dark:text-slate-100'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                    {stage.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="block sm:hidden space-y-3">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;

          return (
            <div key={stage.key} className="flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  isCompleted
                    ? 'bg-red-600 text-white'
                    : isCurrent
                    ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
              </div>
              <div className="flex-1 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-red-600 dark:text-red-400'
                        : isCompleted
                        ? 'text-slate-900 dark:text-slate-100'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
