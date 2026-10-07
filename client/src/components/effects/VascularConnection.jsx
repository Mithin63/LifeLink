import React from 'react';

export const VascularConnection = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none select-none overflow-visible ${className}`}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Crimson Red Glow Gradient */}
          <linearGradient id="vascGrad1" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.3" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main Branch 1 */}
        <path
          d="M 10 150 H 120 L 170 100 H 260 L 300 130 H 390"
          stroke="url(#vascGrad1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          opacity="0.85"
        />

        {/* Branch 2 (Upwards) */}
        <path
          d="M 120 150 L 160 60 H 240 L 280 90 H 370"
          stroke="#e11d48"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />

        {/* Branch 3 (Downwards) */}
        <path
          d="M 170 100 L 210 210 H 290 L 330 180 H 395"
          stroke="#f43f5e"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />

        {/* Minor Capillary Offshoots */}
        <path
          d="M 160 60 L 190 30 H 270"
          stroke="#dc2626"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M 210 210 L 240 260 H 320"
          stroke="#dc2626"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Circuit Nodes with Pulsing Rings */}
        <g className="animate-pulse">
          <circle cx="120" cy="150" r="4.5" fill="#ef4444" />
          <circle cx="170" cy="100" r="4.5" fill="#f43f5e" />
          <circle cx="260" cy="100" r="4.5" fill="#ef4444" />
          <circle cx="160" cy="60" r="3.5" fill="#f43f5e" />
          <circle cx="210" cy="210" r="4" fill="#ef4444" />
          <circle cx="290" cy="210" r="3.5" fill="#f43f5e" />
        </g>

        {/* Traveling Bio-Electrical Blood Pulses */}
        <circle r="3.5" fill="#ffffff" filter="url(#glow)">
          <animateMotion
            path="M 10 150 H 120 L 170 100 H 260 L 300 130 H 390"
            dur="3.2s"
            repeatCount="indefinite"
          />
        </circle>

        <circle r="2.5" fill="#ffe4e6" filter="url(#glow)">
          <animateMotion
            path="M 120 150 L 160 60 H 240 L 280 90 H 370"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        <circle r="2.8" fill="#ffffff" filter="url(#glow)">
          <animateMotion
            path="M 170 100 L 210 210 H 290 L 330 180 H 395"
            dur="3.6s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};
