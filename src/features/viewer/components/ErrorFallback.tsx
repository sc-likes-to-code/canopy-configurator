import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onRetry }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md p-6 z-20 text-center">
      <div className="rounded-full bg-red-500/10 p-4 mb-4 border border-red-500/20">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">3D Asset Loading Error</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        {error?.message || 'Failed to render GLB model file. Please ensure model files are present in public/models/.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all border border-slate-700"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Scene
        </button>
      )}
    </div>
  );
};
