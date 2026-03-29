import React from 'react';
import { Search, Navigation as NavIcon, User, Sun } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#1a1c1e] overflow-hidden rounded-l-3xl shadow-2xl">
      {/* Map Background Simulation */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url('https://picsum.photos/seed/map/1200/800')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) contrast(120%) brightness(0.5)'
        }}
      />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />

      {/* Navigation UI Elements */}
      <div className="absolute top-8 left-8 flex gap-4">
        <div className="w-14 h-14 bg-black/60 backdrop-blur-md rounded-2xl flex items-center justify-center text-white/80 shadow-xl border border-white/5">
          <Search size={24} />
        </div>
      </div>

      <div className="absolute top-8 right-8">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
          <img src="https://picsum.photos/seed/user/100/100" alt="User" referrerPolicy="no-referrer" />
        </div>
      </div>

      {/* Navigation Card */}
      <div className="absolute top-32 left-8 w-80 bg-black/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="text-white">
            <NavIcon size={32} className="rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">1.2 mi</span>
            <span className="text-sm text-white/60 mt-1">Take the exit toward Disney Springs</span>
          </div>
        </div>
      </div>

      {/* Route Line Simulation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path 
          d="M 100 800 Q 400 600 600 400 T 1000 100" 
          fill="none" 
          stroke="#007aff" 
          strokeWidth="6.4" 
          strokeLinecap="round"
          className="opacity-80"
        />
        <circle cx="100" cy="800" r="10" fill="#ff4444" />
        <circle cx="1000" cy="100" r="10" fill="#00ff00" />
      </svg>

      {/* Bottom Status */}
      <div className="absolute bottom-8 right-8 flex items-center gap-6 bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 text-white/80">
          <Sun size={18} />
          <span className="text-sm font-medium">72° AQI 58</span>
        </div>
        <div className="w-[1px] h-4 bg-white/10" />
        <div className="text-white/80">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center">
            <span className="text-[10px] font-bold">N</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
