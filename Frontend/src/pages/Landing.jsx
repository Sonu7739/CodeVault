import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Code2,
  FolderGit2,
  Share2,
  Search,
  Sparkles,
  ArrowRight,
  Terminal,
  Layers,
  Lock,
  Globe,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CodeViewer from '../components/CodeViewer';
import Footer from '../components/Footer';

const sampleSnippet = `// CodeVault: Instant snippet lookup & sharing
import { createVault } from '@codevault/core';

export async function getOptimizedQuery(db, filter) {
  const cacheKey = \`vault:\${filter.lang}\`;
  const cached = await db.cache.get(cacheKey);
  if (cached) return cached;

  const result = await db.snippets.find({
    visibility: 'public',
    tags: { $in: filter.tags }
  }).sort({ likes: -1 }).limit(10);

  await db.cache.set(cacheKey, result, 3600);
  return result;
}`;

const features = [
  {
    icon: Code2,
    title: 'Save Your Snippets',
    description: 'Keep your battle-tested algorithms, boilerplate configs, and utility functions in one unified cloud vault.'
  },
  {
    icon: FolderGit2,
    title: 'Organize Your Code',
    description: 'Categorize snippets across 17+ languages with multi-tag filtering, privacy controls, and instant search.'
  },
  {
    icon: Share2,
    title: 'Share With Developers',
    description: 'Generate clean, shareable permalinks for your teammates or publish publicly to help fellow engineers.'
  },
  {
    icon: Search,
    title: 'Discover Useful Code',
    description: 'Explore the community vault for production-ready solutions, bookmark your favorites, and vote on top code.'
  }
];

const steps = [
  {
    number: '01',
    title: 'Capture Code In Seconds',
    description: 'Paste code directly into the editor with automatic language syntax highlighting, title, description, and custom tags.'
  },
  {
    number: '02',
    title: 'Control Privacy & Storage',
    description: 'Choose between Private (visible strictly to your account) or Public (discoverable in the community explore feed).'
  },
  {
    number: '03',
    title: 'Access Anywhere & Share',
    description: 'One-click clipboard copy, clean syntax-highlighted viewers, and direct share URLs ready for your team Slack or Discord.'
  }
];

const languages = [
  'JavaScript', 'Python', 'TypeScript', 'Java', 'Go', 'Rust',
  'C++', 'C#', 'SQL', 'HTML', 'CSS', 'PHP', 'Kotlin', 'Bash', 'JSON'
];

export const Landing = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-vault-bg text-slate-100 flex flex-col selection:bg-purple-brand/30 selection:text-purple-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-vault-bg/90 backdrop-blur-md border-b border-vault-border">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-brand to-blue-brand flex items-center justify-center text-white shadow-glow-purple">
              <Shield className="w-5 h-5 fill-white/20" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-brand transition">
              Code<span className="text-purple-brand">Vault</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-purple-brand transition">Features</a>
            <a href="#how-it-works" className="hover:text-purple-brand transition">How It Works</a>
            <a href="#languages" className="hover:text-purple-brand transition">Languages</a>
            <Link to="/explore" className="hover:text-purple-brand transition">Community Explore</Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-brand hover:bg-purple-brand-hover text-white text-sm font-medium transition shadow-glow-purple"
              >
                <span>Dashboard ({user?.username})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-purple-brand hover:bg-purple-brand-hover text-white text-sm font-medium transition shadow-glow-purple"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-vault-border">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-[400px] h-[250px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Developer Code Repository</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Your Code. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-brand via-purple-300 to-blue-brand">
                  Your Vault.
                </span>{' '}
                <br className="hidden sm:inline" />
                Your Community.
              </h1>

              <p className="text-base sm:text-lg text-vault-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                CodeVault gives software engineers a dedicated workspace to store, organize, and execute reusable code snippets. Toggle between private vaults and the public developer community seamlessly.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/register'}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-purple-brand hover:bg-purple-brand-hover text-white font-semibold text-sm transition shadow-glow-purple flex items-center justify-center gap-2"
                >
                  <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/explore"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 border border-vault-border hover:border-slate-700 text-slate-200 font-semibold text-sm transition flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-purple-brand" />
                  <span>Explore Snippets</span>
                </Link>
              </div>

              {/* Developer Highlights */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-vault-subtle">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant 1-Click Copy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Private & Public Visibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>17+ Languages Supported</span>
                </div>
              </div>
            </div>

            {/* Right Code Preview Illustration */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-2xl blur-lg opacity-70"></div>
              <div className="relative">
                <CodeViewer
                  code={sampleSnippet}
                  language="TypeScript"
                  showLineNumbers={true}
                  showCopy={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-24 border-b border-vault-border bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-mono text-purple-brand font-semibold">
              Designed for Engineers
            </h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              Everything you need to manage your personal snippet vault
            </h3>
            <p className="text-sm text-vault-muted leading-relaxed">
              Eliminate lost terminal commands, forgotten regex recipes, and scattered gist links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-vault-card border border-vault-border hover:border-purple-brand/40 hover:bg-vault-card-hover transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-purple-brand/10 border border-purple-brand/20 flex items-center justify-center text-purple-brand mb-5 group-hover:scale-105 transition-transform shadow-glow-purple">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-vault-muted leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 border-b border-vault-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-mono text-blue-brand font-semibold">
              Workflow
            </h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              How CodeVault Works
            </h3>
            <p className="text-sm text-vault-muted leading-relaxed">
              Three seamless steps from your IDE into your persistent cloud vault.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-vault-card border border-vault-border flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black font-mono text-purple-brand/40">
                    {s.number}
                  </span>
                  <Layers className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{s.title}</h4>
                  <p className="text-xs text-vault-muted leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Supported Section */}
      <section id="languages" className="py-20 border-b border-vault-border bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-xl mx-auto mb-10 space-y-2">
            <h3 className="text-2xl font-bold text-white">Full Syntax Highlighting For 17+ Languages</h3>
            <p className="text-xs text-vault-muted">
              From systems programming in Rust and C++ to modern web frameworks and database queries.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
            {languages.map((lang) => (
              <Link
                key={lang}
                to={`/explore?language=${lang}`}
                className="px-4 py-2 rounded-xl bg-vault-card border border-vault-border hover:border-purple-brand/50 hover:bg-purple-brand/10 hover:text-purple-300 text-xs font-mono font-medium text-slate-300 transition"
              >
                {lang}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to build your personal code vault?
          </h2>
          <p className="text-sm text-vault-muted max-w-lg mx-auto">
            Join developers managing and sharing high-quality code snippets today.
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-brand hover:bg-purple-brand-hover text-white font-semibold text-sm transition shadow-glow-purple"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;

