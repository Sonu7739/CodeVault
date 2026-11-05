import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Code2, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-vault-border bg-vault-sidebar text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-brand to-blue-brand flex items-center justify-center text-white">
                <Shield className="w-4 h-4 fill-white/20" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">
                Code<span className="text-purple-brand">Vault</span>
              </span>
            </Link>
            <p className="text-xs text-vault-muted leading-relaxed">
              "Your Code. Your Vault. Your Community." A modern platform for developers to store, manage, and share frequently used code snippets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" className="hover:text-purple-brand transition">Explore Snippets</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-purple-brand transition">Dashboard</Link>
              </li>
              <li>
                <Link to="/snippets/new" className="hover:text-purple-brand transition">Add Snippet</Link>
              </li>
              <li>
                <Link to="/bookmarks" className="hover:text-purple-brand transition">Bookmarks</Link>
              </li>
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Popular Languages</h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Rust', 'SQL', 'C++'].map((l) => (
                <Link
                  key={l}
                  to={`/explore?language=${l}`}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-purple-brand/20 hover:text-purple-300 border border-slate-700/60 text-[11px] transition"
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* Community & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Connect</h4>
            <div className="flex items-center gap-3 mb-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-purple-brand hover:text-white transition"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-brand hover:text-white transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-purple-400">
                <Code2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-vault-subtle">
              Engineered for developer productivity with MongoDB Atlas and Node.js.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-vault-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-vault-subtle">
          <div>
            © {new Date().getFullYear()} CodeVault. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with precision for developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

