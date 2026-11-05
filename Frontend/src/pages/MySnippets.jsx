import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Code2,
  Plus,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  Lock,
  Globe,
  Trash2,
  Edit2
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import SnippetCard from '../components/SnippetCard';
import SearchBar from '../components/SearchBar';
import LanguageFilter from '../components/LanguageFilter';
import { CardSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { snippetService } from '../services/snippetService';
import { useToast } from '../context/ToastContext';

export const MySnippets = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { success, error } = useToast();

  const [snippets, setSnippets] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [language, setLanguage] = useState(searchParams.get('language') || 'all');
  const [visibility, setVisibility] = useState(searchParams.get('visibility') || 'all');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMySnippets = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await snippetService.getMySnippets({
        search: search.trim() || undefined,
        language: language !== 'all' ? language : undefined,
        visibility: visibility !== 'all' ? visibility : undefined,
        sort,
        page,
        limit: 12
      });

      if (res.success) {
        setSnippets(res.snippets || []);
        setTotal(res.total || 0);
        setPages(res.pages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch snippets:', err);
      error(err.response?.data?.message || 'Failed to load your snippets');
    } finally {
      setIsLoading(false);
    }
  }, [search, language, visibility, sort, page, error]);

  useEffect(() => {
    fetchMySnippets();
  }, [fetchMySnippets]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await snippetService.deleteSnippet(deleteTarget._id);
      success('Snippet deleted successfully');
      setDeleteTarget(null);
      fetchMySnippets();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete snippet');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-6 h-6 text-purple-brand" />
            <span>My Snippets</span>
          </h1>
          <p className="text-xs text-vault-muted mt-1">
            Manage your personal library of private and public code snippets ({total} total).
          </p>
        </div>

        <Link
          to="/snippets/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-brand hover:bg-purple-brand-hover text-white text-sm font-semibold transition shadow-glow-purple self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Snippet</span>
        </Link>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-vault-card border border-vault-border rounded-xl p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            onClear={() => {
              setSearch('');
              setPage(1);
            }}
            placeholder="Search your snippets..."
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <LanguageFilter
              selectedLanguage={language}
              onChange={(val) => {
                setLanguage(val);
                setPage(1);
              }}
            />

            {/* Visibility Filter */}
            <select
              value={visibility}
              onChange={(e) => {
                setVisibility(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by visibility"
              className="bg-vault-card border border-vault-border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-brand transition cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Visibility</option>
              <option value="public" className="bg-slate-900">Public Only</option>
              <option value="private" className="bg-slate-900">Private Only</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort snippets"
              className="bg-vault-card border border-vault-border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-brand transition cursor-pointer"
            >
              <option value="newest" className="bg-slate-900">Newest First</option>
              <option value="oldest" className="bg-slate-900">Oldest First</option>
              <option value="title" className="bg-slate-900">Alphabetical (A-Z)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-vault-border">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-purple-brand text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-purple-brand text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Snippet Grid / List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : snippets.length > 0 ? (
        <>
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'flex flex-col gap-4'
            }
          >
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                onDelete={(item) => setDeleteTarget(item)}
                showAuthor={false}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-vault-border">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-vault-border text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition"
              >
                Previous
              </button>
              <span className="text-xs text-vault-subtle font-mono px-2">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, pages))}
                disabled={page === pages}
                className="px-3 py-1.5 rounded-lg border border-vault-border text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No snippets matched your criteria"
          description={
            search || language !== 'all' || visibility !== 'all'
              ? 'Try adjusting your search terms or clearing filters to see more results.'
              : 'You have not added any snippets to your vault yet.'
          }
          actionLabel="Create Snippet"
          actionLink="/snippets/new"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Snippet"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
};

export default MySnippets;

