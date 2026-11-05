import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Flame, Clock, Tag as TagIcon, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import SnippetCard from '../components/SnippetCard';
import SearchBar from '../components/SearchBar';
import LanguageFilter from '../components/LanguageFilter';
import { CardSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { snippetService } from '../services/snippetService';
import { useToast } from '../context/ToastContext';

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { error } = useToast();

  const [snippets, setSnippets] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [language, setLanguage] = useState(searchParams.get('language') || 'all');
  const [tag, setTag] = useState(searchParams.get('tag') || 'all');
  const [sort, setSort] = useState('newest'); // 'newest' | 'likes' | 'oldest'

  // Sync URL search params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlLang = searchParams.get('language');
    const urlTag = searchParams.get('tag');

    if (urlSearch !== null && urlSearch !== search) setSearch(urlSearch);
    if (urlLang !== null && urlLang !== language) setLanguage(urlLang);
    if (urlTag !== null && urlTag !== tag) setTag(urlTag);
  }, [searchParams]);

  const fetchExploreSnippets = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await snippetService.getExploreSnippets({
        search: search.trim() || undefined,
        language: language !== 'all' ? language : undefined,
        tag: tag !== 'all' ? tag : undefined,
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
      console.error('Error loading explore snippets:', err);
      error(err.response?.data?.message || 'Failed to load community snippets');
    } finally {
      setIsLoading(false);
    }
  }, [search, language, tag, sort, page, error]);

  useEffect(() => {
    fetchExploreSnippets();
  }, [fetchExploreSnippets]);

  // Extract common tags from current snippets for quick tag cloud
  const popularTags = Array.from(
    new Set(snippets.flatMap((s) => s.tags || []))
  ).slice(0, 10);

  return (
    <DashboardLayout>
      {/* Community Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-purple-950/40 border border-vault-border p-6 md:p-8 mb-8 shadow-card">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono">
            <Compass className="w-3.5 h-3.5" />
            <span>Community Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore Public Snippets
          </h1>
          <p className="text-xs sm:text-sm text-vault-muted leading-relaxed">
            Discover battle-tested code snippets, algorithms, and configurations published by developers worldwide.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
            placeholder="Search community snippets by keywords..."
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <LanguageFilter
              selectedLanguage={language}
              onChange={(val) => {
                setLanguage(val);
                setPage(1);
              }}
            />

            {/* Sort Tabs */}
            <div className="flex items-center bg-slate-900 border border-vault-border rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSort('newest');
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  sort === 'newest'
                    ? 'bg-purple-brand text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Newest</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSort('likes');
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  sort === 'likes'
                    ? 'bg-purple-brand text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Most Liked</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tag Pills */}
        {popularTags.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-vault-border/60 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 shrink-0 flex items-center gap-1">
              <TagIcon className="w-3 h-3 text-purple-brand" /> Tags:
            </span>
            <button
              onClick={() => {
                setTag('all');
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] transition shrink-0 ${
                tag === 'all'
                  ? 'bg-purple-brand text-white font-medium'
                  : 'bg-slate-900 border border-vault-border text-slate-400 hover:text-white'
              }`}
            >
              All Tags
            </button>
            {popularTags.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTag(t);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] transition shrink-0 ${
                  tag === t
                    ? 'bg-purple-brand text-white font-medium'
                    : 'bg-slate-900 border border-vault-border text-slate-400 hover:text-white'
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Snippet Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                showAuthor={true}
              />
            ))}
          </div>

          {/* Pagination */}
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
          title="No public snippets found"
          description={
            search || language !== 'all' || tag !== 'all'
              ? 'No public snippets match the current search filters. Try clearing filters or searching for another term.'
              : 'Be the first developer to share a public snippet with the community!'
          }
          actionLabel="Share a Snippet"
          actionLink="/snippets/new"
        />
      )}
    </DashboardLayout>
  );
};

export default Explore;

