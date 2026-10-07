import React from 'react';

export const NeuralVascularTree = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none select-none overflow-visible ${className}`}>
      <svg
        viewBox="0 0 700 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Intense Crimson / Bio-Red Radiant Gradient */}
          <linearGradient id="treeGradPrimary" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#dc2626" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#b91c1c" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f87171" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="treeGradSecondary" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#e11d48" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fecdd3" stopOpacity="0.8" />
          </linearGradient>

          {/* High-Intensity Glow Filter */}
          <filter id="vascularGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" result="blur1" />
            <feGaussianBlur stdDeviation="1.5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="sparkGlow">
            <feGaussianBlur stdDeviation="2.5" result="sparkBlur" />
            <feMerge>
              <feMergeNode in="sparkBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Backlight Aura */}
        <ellipse
          cx="480"
          cy="250"
          rx="220"
          ry="180"
          fill="rgba(225, 29, 72, 0.14)"
          filter="url(#vascularGlow)"
        />

        {/* ================= MAIN VASCULAR TRUNK & PRIMARY BRANCHES ================= */}
        {/* Main Central Trunk emerging from right card */}
        <path
          d="M 620 250 H 510 L 460 210 H 380 L 330 160 H 210 L 160 110 H 40"
          stroke="url(#treeGradPrimary)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#vascularGlow)"
        />

        <path
          d="M 620 250 H 510 L 460 290 H 390 L 340 340 H 220 L 170 390 H 50"
          stroke="url(#treeGradPrimary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#vascularGlow)"
        />

        {/* Upper Major Arterial System */}
        <path
          d="M 510 250 L 470 170 H 390 L 350 110 H 260 L 220 70 H 90 L 50 40 H 10"
          stroke="url(#treeGradSecondary)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#vascularGlow)"
        />

        <path
          d="M 470 170 L 440 120 H 360 L 320 80 H 210"
          stroke="url(#treeGradSecondary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 380 210 L 340 150 H 250 L 210 110 H 110"
          stroke="url(#treeGradPrimary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lower Major Arterial System */}
        <path
          d="M 510 250 L 470 330 H 400 L 350 400 H 260 L 210 440 H 90 L 50 470 H 15"
          stroke="url(#treeGradSecondary)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#vascularGlow)"
        />

        <path
          d="M 470 330 L 430 380 H 350 L 300 420 H 190"
          stroke="url(#treeGradSecondary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 390 290 L 350 350 H 270 L 220 390 H 120"
          stroke="url(#treeGradPrimary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ================= SECONDARY CAPILLARIES & CIRCUIT EXTENSIONS ================= */}
        <path
          d="M 330 160 L 300 120 H 230 L 200 80 H 140"
          stroke="#f43f5e"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 260 110 L 230 60 H 160"
          stroke="#ef4444"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 210 110 L 180 150 H 100"
          stroke="#f87171"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
        />

        <path
          d="M 340 340 L 310 380 H 240 L 200 420 H 130"
          stroke="#f43f5e"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 270 350 L 240 400 H 170"
          stroke="#ef4444"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 220 390 L 190 350 H 110"
          stroke="#f87171"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Lateral Fine Grid Connections */}
        <path d="M 380 210 H 310 L 270 250 H 180 L 140 210 H 60" stroke="#dc2626" strokeWidth="1.2" opacity="0.6" />
        <path d="M 390 290 H 320 L 270 250 H 180 L 140 290 H 70" stroke="#dc2626" strokeWidth="1.2" opacity="0.6" />

        {/* Micro-Branch Vertical Connectors */}
        <line x1="160" y1="110" x2="160" y2="135" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
        <line x1="260" y1="70" x2="260" y2="90" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
        <line x1="170" y1="390" x2="170" y2="365" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
        <line x1="260" y1="440" x2="260" y2="415" stroke="#ef4444" strokeWidth="1" opacity="0.5" />

        {/* ================= GLOWING NODES & JUNCTION PINS ================= */}
        <g filter="url(#sparkGlow)">
          {/* Central Junctions */}
          <circle cx="510" cy="250" r="5" fill="#ffffff" />
          <circle cx="460" cy="210" r="4.5" fill="#ff4d6d" />
          <circle cx="460" cy="290" r="4.5" fill="#ff4d6d" />
          <circle cx="470" cy="170" r="4" fill="#ff758f" />
          <circle cx="470" cy="330" r="4" fill="#ff758f" />

          {/* Mid Branches */}
          <circle cx="380" cy="210" r="4" fill="#ffffff" />
          <circle cx="390" cy="290" r="4" fill="#ffffff" />
          <circle cx="330" cy="160" r="3.5" fill="#ff4d6d" />
          <circle cx="340" cy="340" r="3.5" fill="#ff4d6d" />
          <circle cx="350" cy="110" r="3.5" fill="#ff758f" />
          <circle cx="350" cy="400" r="3.5" fill="#ff758f" />

          {/* Peripheral Terminals */}
          <circle cx="210" cy="160" r="3" fill="#ffffff" />
          <circle cx="220" cy="340" r="3" fill="#ffffff" />
          <circle cx="160" cy="110" r="3" fill="#ff4d6d" />
          <circle cx="170" cy="390" r="3" fill="#ff4d6d" />
          <circle cx="90" cy="70" r="2.5" fill="#ffffff" />
          <circle cx="90" cy="440" r="2.5" fill="#ffffff" />
          <circle cx="40" cy="110" r="2.5" fill="#ff758f" />
          <circle cx="50" cy="390" r="2.5" fill="#ff758f" />
          <circle cx="10" cy="40" r="2" fill="#ffffff" />
          <circle cx="15" cy="470" r="2" fill="#ffffff" />
        </g>

        {/* ================= TRAVELING BIO-PULSES (Continuous Fluid Animation) ================= */}
        {/* Pulse 1: Main Central Upper Line */}
        <circle r="4" fill="url(#pulseGrad)" filter="url(#sparkGlow)">
          <animateMotion
            path="M 620 250 H 510 L 460 210 H 380 L 330 160 H 210 L 160 110 H 40"
            dur="2.8s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Pulse 2: Main Central Lower Line */}
        <circle r="4" fill="url(#pulseGrad)" filter="url(#sparkGlow)">
          <animateMotion
            path="M 620 250 H 510 L 460 290 H 390 L 340 340 H 220 L 170 390 H 50"
            dur="3.2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Pulse 3: Upper Perimeter Branch */}
        <circle r="3" fill="#ffffff" filter="url(#sparkGlow)">
          <animateMotion
            path="M 510 250 L 470 170 H 390 L 350 110 H 260 L 220 70 H 90 L 50 40 H 10"
            dur="3.8s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Pulse 4: Lower Perimeter Branch */}
        <circle r="3" fill="#ffffff" filter="url(#sparkGlow)">
          <animateMotion
            path="M 510 250 L 470 330 H 400 L 350 400 H 260 L 210 440 H 90 L 50 470 H 15"
            dur="4.1s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Pulse 5: Mid Tributary (Rapid Spark) */}
        <circle r="2.5" fill="#ffe4e6" filter="url(#sparkGlow)">
          <animateMotion
            path="M 470 170 L 440 120 H 360 L 320 80 H 210"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};
