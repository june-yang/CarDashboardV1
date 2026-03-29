import React, { useState } from 'react';
import { Music, Wind, Lightbulb, ShieldAlert } from 'lucide-react';

const Controls: React.FC = () => {
  const [wiperMode, setWiperMode] = useState<'Auto' | 'On'>('Auto');
  const [wiperLevel, setWiperLevel] = useState(2);

  return (
    <div className="w-full px-4 pb-6 flex flex-col gap-5">
      {/* Quick Access Buttons */}
      <div className="flex justify-center gap-3">
        <ControlButton icon={<Music size={24} />} />
        <ControlButton icon={<Wind size={24} />} />
        <ControlButton icon={<Lightbulb size={24} />} active />
        <ControlButton icon={<ShieldAlert size={24} />} />
      </div>

      {/* Wiper Controls */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Wipers</span>
        
        <div className="flex bg-white/5 rounded-xl p-1.5 w-full max-w-[340px]">
          <button
            onClick={() => setWiperMode('Auto')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              wiperMode === 'Auto' ? 'bg-blue-500 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
            }`}
          >
            Auto
          </button>
          <button
            onClick={() => setWiperMode('On')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              wiperMode === 'On' ? 'bg-blue-500 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
            }`}
          >
            On
          </button>
        </div>

        {/* 5-Level Slider */}
        <div className="flex gap-1.5 w-full max-w-[340px] h-10">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              onClick={() => setWiperLevel(level)}
              className={`flex-1 rounded-lg cursor-pointer transition-all ${
                level <= wiperLevel 
                  ? 'bg-white/40' 
                  : 'bg-white/10'
              } hover:bg-white/50`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ControlButton: React.FC<{ icon: React.ReactNode; active?: boolean }> = ({ icon, active }) => (
  <div className={`w-20 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
    active ? 'bg-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
  }`}>
    {icon}
  </div>
);

export default Controls;
