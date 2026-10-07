import React from 'react';
import { Droplet } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BLOOD_INFO = {
  'A+': { gives: 'A+, AB+', receives: 'A+, A-, O+, O-' },
  'A-': { gives: 'A+, A-, AB+, AB-', receives: 'A-, O-' },
  'B+': { gives: 'B+, AB+', receives: 'B+, B-, O+, O-' },
  'B-': { gives: 'B+, B-, AB+, AB-', receives: 'B-, O-' },
  'AB+': { gives: 'AB+ only', receives: 'Universal Recipient' },
  'AB-': { gives: 'AB+, AB-', receives: 'AB-, A-, B-, O-' },
  'O+': { gives: 'O+, A+, B+, AB+', receives: 'O+, O-' },
  'O-': { gives: 'Universal Donor', receives: 'O- only' },
};

export const BloodGroupSelector = ({
  selected,
  onChange,
  showAll = false,
  allLabel = 'All Groups',
  counts = {},
  size = 'md',
  showDetails = false,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5">
        {showAll && (
          <button
            type="button"
            onClick={() => onChange('')}
            className={`col-span-4 sm:col-span-8 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 border ${
              !selected
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-300 dark:hover:border-red-900/50'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>{allLabel}</span>
          </button>
        )}

        {BLOOD_GROUPS.map((bg) => {
          const isSelected = selected === bg;
          const count = counts[bg];

          return (
            <button
              key={bg}
              type="button"
              onClick={() => onChange(isSelected && !showAll ? '' : bg)}
              className={`group relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border transition-all duration-150 hover-lift ${
                isSelected
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-red-300 dark:hover:border-red-900/60'
              }`}
            >
              <div className="flex items-center gap-1">
                <Droplet
                  className={`w-3.5 h-3.5 blood-drop-bounce ${
                    isSelected
                      ? 'fill-white text-white'
                      : 'text-red-500 fill-red-500/20 group-hover:fill-red-500/40'
                  }`}
                />
                <span className="text-base sm:text-lg font-extrabold tracking-tight">
                  {bg}
                </span>
              </div>

              {count !== undefined && (
                <span
                  className={`mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count} {count === 1 ? 'donor' : 'donors'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {showDetails && selected && BLOOD_INFO[selected] && (
        <div className="mt-3 p-3 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-700 dark:text-red-400">
              {selected} Compatibility:
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              Can give to: <strong>{BLOOD_INFO[selected].gives}</strong>
            </span>
          </div>
          <div className="text-slate-600 dark:text-slate-400 text-[11px]">
            Can receive from: {BLOOD_INFO[selected].receives}
          </div>
        </div>
      )}
    </div>
  );
};
