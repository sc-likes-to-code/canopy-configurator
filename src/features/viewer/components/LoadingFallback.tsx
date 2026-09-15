import React from 'react';
import { Html, useProgress } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

export const LoadingFallback: React.FC = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center rounded-xl bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md border border-slate-800 text-slate-200 min-w-[220px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-3" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Loading 3D Model</span>
        <span className="text-lg font-bold text-white mt-1">{Math.round(progress)}%</span>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-200 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </Html>
  );
};
