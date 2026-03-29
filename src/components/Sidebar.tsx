import React, { useState, useEffect } from 'react';
import { 
  Signal, 
  Music, 
  Phone, 
  Mic2, 
  Compass, 
  LayoutGrid, 
  Tv
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  return (
    <div className="w-20 h-full bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-6 gap-6 z-50">
      {/* Time & 5G - Aligned with icons */}
      <div className="flex flex-col items-center gap-1 mb-4">
        <span className="text-xl font-bold tracking-tight text-white">
          {formatTime(time)}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-black text-white/60">5G</span>
          <div className="flex items-end gap-[1px] h-2">
            <div className="w-[2px] h-[30%] bg-white/60" />
            <div className="w-[2px] h-[50%] bg-white/60" />
            <div className="w-[2px] h-[75%] bg-white/60" />
            <div className="w-[2px] h-[100%] bg-white/60" />
          </div>
        </div>
        <div className="flex flex-col items-center mt-2">
          <div className="w-8 h-4 border border-white/30 rounded-sm relative p-[1px]">
            <div className="h-full bg-green-500 w-[85%]" />
            <div className="absolute -right-1 top-1 w-1 h-2 bg-white/30 rounded-r-sm" />
          </div>
          <span className="text-[9px] text-white/40 font-bold mt-1">288mi</span>
        </div>
      </div>

      <div className="w-10 h-[1px] bg-white/10" />

      {/* App Shortcuts */}
      <div className="flex flex-col gap-5 items-center flex-1">
        <AppIcon color="bg-white" icon={<LayoutGrid size={22} className="text-black" />} />
        <AppIcon color="bg-red-500" icon={<Music size={22} className="text-white" />} />
        <AppIcon color="bg-green-500" icon={<Phone size={22} className="text-white" />} />
        <AppIcon color="bg-purple-500" icon={<Mic2 size={22} className="text-white" />} />
        <AppIcon color="bg-blue-500" icon={<Compass size={22} className="text-white" />} />
        <AppIcon color="bg-blue-600" icon={<Tv size={22} className="text-white" />} />
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col gap-5 items-center">
        <div className="p-2 text-white/40 hover:text-white transition-colors cursor-pointer">
          <LayoutGrid size={24} />
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 p-[2px]">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-white/20 blur-sm animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

const AppIcon: React.FC<{ color: string; icon: React.ReactNode }> = ({ color, icon }) => (
  <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform active:scale-95`}>
    {icon}
  </div>
);

export default Sidebar;
