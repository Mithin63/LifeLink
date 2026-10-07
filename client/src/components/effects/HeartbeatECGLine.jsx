import React from 'react';

export const HeartbeatECGLine = ({ className = '' }) => {
  // Clean single ECG heartbeat waveform spanning exactly from left to right
  const ecgPath =
    'M 0 30 L 130 30 L 145 22 L 158 38 L 170 30 L 190 30 L 205 6 L 225 54 L 242 16 L 256 36 L 268 30 L 400 30';

  return (
    <div className={`pointer-events-none select-none overflow-visible ${className}`}>
      <svg
        viewBox="0 0 400 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Soft Neon Glow Filter */}
          <filter id="ecgCleanGlow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Electric Pulse Gradient */}
          <linearGradient id="ecgCleanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
            <stop offset="45%" stopColor="#f43f5e" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="55%" stopColor="#f43f5e" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Subtle Ambient Red Glow */}
        <path
          d={ecgPath}
          stroke="#f43f5e"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          filter="url(#ecgCleanGlow)"
        />

        {/* Clean Fine Core Filament */}
        <path
          d={ecgPath}
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />

        {/* Animated Flowing Laser Stroke */}
        <path
          d={ecgPath}
          stroke="url(#ecgCleanGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="80 320"
          className="ecg-flow-animation"
          filter="url(#ecgCleanGlow)"
        />

        {/* Smooth Traveling Luminous Spark */}
        <circle r="2.2" fill="#ffffff" filter="url(#ecgCleanGlow)">
          <animateMotion
            path={ecgPath}
            dur="2.8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};
