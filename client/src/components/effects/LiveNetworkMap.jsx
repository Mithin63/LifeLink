import React, { useState } from 'react';
import { ShieldCheck, Activity, Users, Building2, MapPin, Heart, Sparkles } from 'lucide-react';

export const LiveNetworkMap = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedNode, setSelectedNode] = useState(null);

  // Network Nodes (Hospitals & Donors across region)
  const nodes = [
    { id: 1, type: 'hospital', name: 'Apollo Trauma Center', blood: 'O-', units: '12 Needed', x: 220, y: 110, city: 'Vijayawada' },
    { id: 2, type: 'donor', name: 'Sneha Reddy (Donor)', blood: 'O-', distance: '2.1 km', x: 180, y: 170, city: 'Benz Circle' },
    { id: 3, type: 'hospital', name: 'City Care Hospital', blood: 'A+', units: '8 Units', x: 460, y: 80, city: 'Governorpet' },
    { id: 4, type: 'donor', name: 'Rahul Kumar (Donor)', blood: 'A+', distance: '1.4 km', x: 390, y: 140, city: 'MG Road' },
    { id: 5, type: 'hospital', name: 'AIIMS Regional Hospital', blood: 'B+', units: '15 Units', x: 670, y: 120, city: 'Mangalagiri' },
    { id: 6, type: 'donor', name: 'Priya Sharma (Donor)', blood: 'B+', distance: '3.8 km', x: 590, y: 190, city: 'Guntur' },
    { id: 7, type: 'donor', name: 'Arjun Patel (Donor)', blood: 'AB+', distance: '4.2 km', x: 280, y: 220, city: 'Tenali' },
    { id: 8, type: 'hospital', name: 'Sunrise Multispecialty', blood: 'O+', units: '4 Units', x: 740, y: 210, city: 'Kothapet' },
  ];

  // Animated Arcs connecting donors to hospitals
  const connections = [
    { from: { x: 180, y: 170 }, to: { x: 220, y: 110 }, color: '#ef4444' },
    { from: { x: 390, y: 140 }, to: { x: 460, y: 80 }, color: '#f43f5e' },
    { from: { x: 590, y: 190 }, to: { x: 670, y: 120 }, color: '#38bdf8' },
    { from: { x: 280, y: 220 }, to: { x: 460, y: 80 }, color: '#ef4444' },
    { from: { x: 590, y: 190 }, to: { x: 740, y: 210 }, color: '#38bdf8' },
  ];

  const filteredNodes = nodes.filter(n => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'HOSPITALS') return n.type === 'hospital';
    if (activeFilter === 'DONORS') return n.type === 'donor';
    return true;
  });

  return (
    <section className="relative py-20 bg-[#080c18] text-white overflow-hidden border-b border-slate-800">
      {/* Background World Grid Overlay */}
      <div className="absolute inset-0 bg-medical-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-900/50">
              <Sparkles className="w-3.5 h-3.5" /> Live Geospatial Network
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Connecting Donors <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-400">
                Across Hospitals
              </span>
            </h2>

            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time synchronization between active trauma center requests and voluntary donors within the medical perimeter.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {['ALL', 'HOSPITALS', 'DONORS'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeFilter === f
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  {f === 'ALL' && '🌐 All Nodes'}
                  {f === 'HOSPITALS' && '🏥 Trauma Centers'}
                  {f === 'DONORS' && '🔴 Live Donors'}
                </button>
              ))}
            </div>

            {/* Active Live Metric Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Response</span>
                <span className="text-lg font-black text-emerald-400">3.8 mins</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Corridors</span>
                <span className="text-lg font-black text-red-400">14 Routes</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Animated Map Graphic */}
          <div className="lg:col-span-8">
            <div className="relative w-full aspect-[16/10] max-h-[460px] bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-4 overflow-hidden flex items-center justify-center">
              {/* World/Regional Map Outline SVG */}
              <svg
                viewBox="0 0 900 320"
                className="w-full h-full select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
                  </linearGradient>

                  <filter id="mapGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Continents / Regional Silhouettes */}
                <path
                  d="M100 80 Q140 60 200 90 T300 85 T380 120 T340 180 T260 240 T160 220 T80 160 Z"
                  fill="#141c2e"
                  opacity="0.6"
                />
                <path
                  d="M450 60 Q520 40 600 70 T720 90 T780 160 T700 240 T580 230 T480 180 Z"
                  fill="#141c2e"
                  opacity="0.6"
                />
                <path
                  d="M720 180 Q780 160 840 190 T860 260 T800 290 T730 260 Z"
                  fill="#141c2e"
                  opacity="0.5"
                />

                {/* Connecting Curved Beziers with Glowing Arcs */}
                {connections.map((c, i) => (
                  <g key={`conn-${i}`}>
                    {/* Background Arc */}
                    <path
                      d={`M ${c.from.x} ${c.from.y} Q ${(c.from.x + c.to.x) / 2} ${
                        Math.min(c.from.y, c.to.y) - 45
                      } ${c.to.x} ${c.to.y}`}
                      stroke="url(#arcGlow)"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      fill="none"
                      opacity="0.75"
                    />

                    {/* Animated Light Pulse traveling on Arc */}
                    <circle r="3.5" fill="#ffffff" filter="url(#mapGlow)">
                      <animateMotion
                        path={`M ${c.from.x} ${c.from.y} Q ${(c.from.x + c.to.x) / 2} ${
                          Math.min(c.from.y, c.to.y) - 45
                        } ${c.to.x} ${c.to.y}`}
                        dur={`${2.5 + i * 0.6}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ))}

                {/* Animated Pulsing Map Nodes */}
                {filteredNodes.map((n) => {
                  const isHospital = n.type === 'hospital';
                  const isSelected = selectedNode?.id === n.id;

                  return (
                    <g
                      key={n.id}
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => setSelectedNode(n)}
                    >
                      {/* Pulse Wave */}
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={isHospital ? '14' : '10'}
                        fill={isHospital ? '#ef4444' : '#38bdf8'}
                        opacity="0.25"
                        className="animate-ping"
                        style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                      />

                      {/* Main Node Circle */}
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={isHospital ? '8' : '6'}
                        fill={isHospital ? '#dc2626' : '#0ea5e9'}
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="url(#mapGlow)"
                      />

                      {/* Blood Type Label */}
                      <text
                        x={n.x}
                        y={n.y - 12}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {n.blood}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Node Details Floating Card */}
              {selectedNode && (
                <div className="absolute bottom-4 right-4 bg-slate-900/95 border border-red-500/50 p-4 rounded-2xl shadow-2xl max-w-xs animate-slide-up z-20 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {selectedNode.type === 'hospital' ? '🏥 Hospital' : '🔴 Voluntary Donor'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px]">
                      {selectedNode.blood}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-100">{selectedNode.name}</h4>
                  <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                    <span>{selectedNode.city}</span>
                    <span className="text-emerald-400 font-semibold">{selectedNode.units || selectedNode.distance}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
