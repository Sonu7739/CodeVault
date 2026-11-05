import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Globe,
  Lock,
  Heart,
  Plus,
  Compass,
  Bookmark,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Terminal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import DashboardLayout from '../components/DashboardLayout';
import SnippetCard from '../components/SnippetCard';
import { CardSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { snippetService } from '../services/snippetService';
import { useToast } from '../context/ToastContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [stats, setStats] = useState(null);
  const [recentSnippets, setRecentSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await dashboardService.getStats();
      if (res.success) {
        setStats(res.stats);
        setRecentSnippets(res.recentSnippets || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await snippetService.deleteSnippet(deleteTarget._id);
      success('Snippet deleted successfully');
      setDeleteTarget(null);
      // Refresh dashboard stats
      fetchDashboardData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete snippet');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/30 via-slate-900 to-blue-950/30 border border-vault-border p-6 md:p-8 mb-8 shadow-card">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Developer Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-purple-brand">{user?.username}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-vault-muted max-w-xl leading-relaxed">
              Here is what is happening across your personal snippets, community contributions, and interactions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/snippets/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-brand hover:bg-purple-brand-hover text-white text-sm font-semibold transition shadow-glow-purple"
            >
              <Plus className="w-4 h-4" />
              <span>Add Snippet</span>
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-vault-border text-slate-200 text-sm font-medium transition"
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Explore</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Real Backend Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Snippets */}
        <div className="bg-vault-card border border-vault-border rounded-xl p-5 hover:border-vault-border-light transition shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-vault-muted">Total Snippets</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-brand">
              <Code2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {isLoading ? '...' : stats?.totalSnippets ?? 0}
          </div>
          <p className="text-[11px] text-vault-subtle mt-1.5 flex items-center gap-1">
            <span>In your personal cloud vault</span>
          </p>
        </div>

        {/* Public Snippets */}
        <div className="bg-vault-card border border-vault-border rounded-xl p-5 hover:border-vault-border-light transition shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-vault-muted">Public Snippets</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-300 font-mono">
            {isLoading ? '...' : stats?.publicSnippets ?? 0}
          </div>
          <p className="text-[11px] text-vault-subtle mt-1.5">Shared with the developer community</p>
        </div>

        {/* Private Snippets */}
        <div className="bg-vault-card border border-vault-border rounded-xl p-5 hover:border-vault-border-light transition shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-vault-muted">Private Snippets</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-300 font-mono">
            {isLoading ? '...' : stats?.privateSnippets ?? 0}
          </div>
          <p className="text-[11px] text-vault-subtle mt-1.5">Secure and visible only to you</p>
        </div>

        {/* Total Likes */}
        <div className="bg-vault-card border border-vault-border rounded-xl p-5 hover:border-vault-border-light transition shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-vault-muted">Total Likes Received</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-300 font-mono">
            {isLoading ? '...' : stats?.totalLikesReceived ?? 0}
          </div>
          <p className="text-[11px] text-vault-subtle mt-1.5">Appreciations from other developers</p>
        </div>
      </div>

      {/* Language Breakdown & Quick Navigation */}
      {stats?.languageBreakdown && Object.keys(stats.languageBreakdown).length > 0 && (
        <div className="mb-8 p-5 bg-vault-card border border-vault-border rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-purple-brand" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Your Tech Stack Distribution
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.languageBreakdown).map(([lang, count]) => (
              <Link
                key={lang}
                to={`/my-snippets?language=${lang}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-vault-border hover:border-purple-brand text-xs transition"
              >
                <span className="font-medium text-slate-200">{lang}</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-purple-500/20 text-purple-300 font-mono">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recently Added Snippets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-brand" />
            <h2 className="text-base font-semibold text-white">Recently Added Snippets</h2>
          </div>
          <Link
            to="/my-snippets"
            className="text-xs text-purple-brand hover:text-purple-300 font-medium flex items-center gap-1 transition"
          >
            <span>View All My Snippets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : recentSnippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentSnippets.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                onDelete={(item) => setDeleteTarget(item)}
                showAuthor={false}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No snippets saved yet"
            description="Your vault is currently empty. Add your first reusable code snippet to see it reflected here."
            actionLabel="Create Snippet"
            actionLink="/snippets/new"
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Snippet"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action is permanent and cannot be undone.`}
        confirmLabel="Delete Snippet"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
};

export default Dashboard;

