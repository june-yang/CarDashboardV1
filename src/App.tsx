import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CarView from './components/CarView';
import Controls from './components/Controls';
import Navigation from './components/Navigation';

export default function App() {
  return (
    <div className="fixed inset-0 bg-black text-white font-sans flex overflow-hidden select-none">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex h-full">
        
        {/* Left Section: Core Control (30%) */}
        <section className="w-[30%] h-full flex flex-col relative border-r border-white/5">
          
          {/* Top Section: Dashboard Info */}
          <div className="flex-shrink-0 h-32 px-10 pt-8 flex flex-col items-center relative">
            <div className="flex flex-col items-center">
              <span className="text-7xl font-bold tracking-tighter leading-none">54</span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1">MPH</span>
            </div>

            <div className="absolute top-8 right-8 flex gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-red-500/50 flex items-center justify-center">
                <span className="text-[10px] font-bold text-red-500">55</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                   <div className="w-0.5 h-2 bg-blue-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section: 3D Visualization */}
          <div className="flex-1 min-h-0 relative">
            <CarView />
          </div>

          {/* Bottom Section: Controls */}
          <div className="flex-shrink-0">
            <Controls />
          </div>
        </section>

        {/* Right Section: Navigation (70%) */}
        <section className="w-[70%] h-full py-4 pr-4">
          <Navigation />
        </section>

      </main>
    </div>
  );
}
