import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-purple-brand`} />
      {text && <p className="text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-vault-card border border-vault-border rounded-xl p-5 animate-pulse flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-slate-800 rounded w-1/3"></div>
        <div className="h-5 bg-slate-800 rounded-full w-16"></div>
      </div>
      <div className="h-4 bg-slate-800/60 rounded w-3/4"></div>
      <div className="h-28 bg-slate-900 rounded-lg border border-slate-800/80"></div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-800"></div>
          <div className="h-3 bg-slate-800 rounded w-20"></div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
          <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

