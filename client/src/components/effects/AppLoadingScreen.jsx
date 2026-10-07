import React, { useState, useEffect } from 'react';
import { Droplet, Heart, ShieldCheck, Activity } from 'lucide-react';

export const AppLoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Bio-Network...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Stage 1: Progress counter & status updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 1;
        if (next === 25) setStatusText('Verifying Hospital Trauma Units...');
        if (next === 55) setStatusText('Connecting Real-Time Donors...');
        if (next === 85) setStatusText('LifeLink Engine Ready...');
        return next;
      });
    }, 28); // ~2.8s total duration

    // Stage 2: Fade out & dismiss after completion
    const completeTimer = setTimeout(() => {
      setIsFadingOut(true);
      const removeTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 600); // fade duration
      return () => clearTimeout(removeTimer);
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050811] text-white transition-all duration-700 select-none overflow-hidden ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Large Fullscreen Blood Drop Falling Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          src="/blood-drop-loading.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-[0.75] contrast-125 saturate-125"
        />
        {/* Cinematic Deep Dark Gradient & Radial Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/30 to-[#050811]/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#050811]/40 to-[#050811]/90" />
      </div>

      {/* Ambient Red Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Centerpiece Content: LifeLink Title & Progress */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6 text-center space-y-6">
        {/* Glowing Blood Droplet Emblem */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-red-500 via-rose-600 to-red-700 flex items-center justify-center text-white shadow-[0_0_45px_rgba(239,68,68,0.7)] ring-2 ring-white/30 animate-pulse">
          <Droplet className="w-9 h-9 sm:w-11 sm:h-11 fill-white drop-shadow-md" />
        </div>

        {/* Brand Title: LifeLink */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Emergency Lifeline Network
          </div>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white flex items-center justify-center gap-3">
            <span className="text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">Life</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-400 drop-shadow-[0_0_40px_rgba(239,68,68,0.9)]">
              Link
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200/90 font-medium tracking-wide drop-shadow-md max-w-sm mx-auto">
            Connecting Donors. Saving Lives. 🩸
          </p>
        </div>

        {/* Glassmorphic Glowing Progress Bar & Status */}
        <div className="w-full max-w-sm space-y-3 pt-2 backdrop-blur-md p-4 rounded-2xl bg-black/40 border border-white/15 shadow-2xl">
          {/* Track */}
          <div className="w-full h-2 bg-slate-900/90 rounded-full overflow-hidden border border-slate-700/60 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_16px_rgba(239,68,68,0.9)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Subtext and percentage */}
          <div className="flex justify-between items-center text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-2 text-slate-200">
              <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              {statusText}
            </span>
            <span className="font-mono text-red-400 font-bold text-sm">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
