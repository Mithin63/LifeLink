import React from 'react';
import { Droplet } from 'lucide-react';

export const LoadingScreen = ({ message = 'Connecting Donors. Saving Lives.' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="relative flex items-center justify-center">
        {/* Subtle pulsing background glow */}
        <div className="absolute w-24 h-24 rounded-full bg-red-500/20 dark:bg-red-500/10 animate-ping" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 z-10">
          <Droplet className="w-9 h-9 fill-white animate-pulse" />
        </div>
      </div>

      <div className="mt-6 text-center">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Blood<span className="text-red-600">Connect</span>
        </h2>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
          {message}
        </p>
      </div>

      {/* Progress line */}
      <div className="w-36 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-red-600 rounded-full w-1/2 animate-slide-up" />
      </div>
    </div>
  );
};
