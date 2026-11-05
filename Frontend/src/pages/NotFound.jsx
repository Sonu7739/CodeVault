import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, Compass, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-vault-bg flex flex-col items-center justify-center p-6 text-center selection:bg-purple-brand/30 selection:text-purple-300">
      <div className="w-20 h-20 rounded-3xl bg-purple-brand/10 border border-purple-brand/30 flex items-center justify-center text-purple-brand mb-6 shadow-glow-purple">
        <Shield className="w-10 h-10" />
      </div>

      <div className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-brand to-blue-brand font-mono mb-4">
        404
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
        Page Not Found In Vault
      </h1>

      <p className="text-sm text-vault-muted max-w-md mb-8 leading-relaxed">
        The snippet or route you are attempting to access does not exist or has been relocated to another address.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-brand hover:bg-purple-brand-hover text-white text-sm font-semibold transition shadow-glow-purple"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-vault-border hover:bg-slate-800 text-slate-200 text-sm font-medium transition"
        >
          <Compass className="w-4 h-4 text-blue-400" />
          <span>Explore Snippets</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

