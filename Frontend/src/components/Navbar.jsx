import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Plus, Search, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated } = useAuth();
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/explore?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-vault-bg/90 backdrop-blur-md border-b border-vault-border px-4 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Small screen logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-brand to-blue-brand flex items-center justify-center text-white">
            <Shield className="w-4 h-4 fill-white/20" />
          </div>
          <span className="font-bold text-white tracking-tight">Code<span className="text-purple-brand">Vault</span></span>
        </Link>
      </div>

      {/* Global Quick Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Search all snippets (Press Enter to explore)..."
            className="w-full bg-slate-900/80 border border-vault-border rounded-xl py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-brand focus:ring-1 focus:ring-purple-brand transition"
          />
        </div>
      </form>

      {/* Right Action buttons */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Link
              to="/snippets/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-brand hover:bg-purple-brand-hover text-white text-xs font-medium transition shadow-md shadow-purple-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Snippet</span>
            </Link>

            <Link
              to={`/profile/${user.username}`}
              className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full bg-slate-900 border border-vault-border hover:border-purple-brand/50 transition"
            >
              <div className="w-7 h-7 rounded-full bg-purple-brand/20 border border-purple-brand/40 flex items-center justify-center text-xs font-bold text-purple-300">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                {user.username}
              </span>
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-1.5 rounded-lg bg-purple-brand hover:bg-purple-brand-hover text-white text-xs font-medium transition shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

