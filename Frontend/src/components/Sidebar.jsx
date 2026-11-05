import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  Compass,
  Bookmark,
  User,
  LogOut,
  Plus,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    info('Logged out successfully');
    navigate('/login');
    if (onClose) onClose();
  };

  const navLinks = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      requiresAuth: true
    },
    {
      name: 'My Snippets',
      path: '/my-snippets',
      icon: Code2,
      requiresAuth: true
    },
    {
      name: 'Explore',
      path: '/explore',
      icon: Compass,
      requiresAuth: false
    },
    {
      name: 'Bookmarks',
      path: '/bookmarks',
      icon: Bookmark,
      requiresAuth: true
    },
    {
      name: 'Profile',
      path: user ? `/profile/${user.username}` : '/login',
      icon: User,
      requiresAuth: true
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-vault-sidebar border-r border-vault-border flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Close on mobile */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-vault-border">
            <NavLink
              to={isAuthenticated ? '/dashboard' : '/'}
              onClick={onClose}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-brand to-blue-brand flex items-center justify-center text-white shadow-glow-purple">
                <Shield className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-purple-brand transition">
                  Code<span className="text-purple-brand">Vault</span>
                </span>
                <span className="block text-[10px] text-vault-subtle uppercase tracking-widest font-mono">
                  v1.0 Pro
                </span>
              </div>
            </NavLink>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Add Snippet Action */}
          <div className="px-4 pt-5 pb-2">
            <NavLink
              to="/snippets/new"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-purple-brand hover:bg-purple-brand-hover text-white text-sm font-medium transition shadow-lg shadow-purple-600/25 group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>Add Snippet</span>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-purple-brand/15 text-purple-300 border border-purple-brand/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850/60 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card & Logout Footer */}
        <div className="p-4 border-t border-vault-border">
          {isAuthenticated && user ? (
            <div className="flex flex-col gap-3">
              <NavLink
                to={`/profile/${user.username}`}
                onClick={onClose}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-brand/20 border border-purple-brand/40 flex items-center justify-center text-sm font-bold text-purple-300 shrink-0">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white group-hover:text-purple-brand transition truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-vault-subtle truncate">{user.email}</p>
                </div>
              </NavLink>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg border border-vault-border text-xs font-medium text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <NavLink
                to="/login"
                onClick={onClose}
                className="text-center py-2 px-3 rounded-lg bg-slate-800 text-xs font-medium text-white hover:bg-slate-700 transition"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                onClick={onClose}
                className="text-center py-2 px-3 rounded-lg border border-purple-brand/40 text-xs font-medium text-purple-300 hover:bg-purple-brand/10 transition"
              >
                Create Account
              </NavLink>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

