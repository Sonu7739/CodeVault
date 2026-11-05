import React, { useState, useEffect, useCallback } from 'react';
import { Bookmark, Compass, Filter } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import SnippetCard from '../components/SnippetCard';
import SearchBar from '../components/SearchBar';
import LanguageFilter from '../components/LanguageFilter';
import { CardSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { bookmarkService } from '../services/bookmarkService';
import { useToast } from '../context/ToastContext';

export const Bookmarks = () => {
  const { error } = useToast();

  const [snippets, setSnippets] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('all');

  const fetchBookmarks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await bookmarkService.getBookmarks({
        search: search.trim() || undefined,
        language: language !== 'all' ? language : undefined,
        page,
        limit: 12
      });

      if (res.success) {
        setSnippets(res.snippets || []);
        setTotal(res.total || 0);
        setPages(res.pages || 1);
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      error(err.response?.data?.message || 'Failed to load your bookmarks');
    } finally {
      setIsLoading(false);
    }
  }, [search, language, page, error]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleBookmarkToggle = (snippetId, isBookmarked) => {
    if (!isBookmarked) {
      // Remove from list smoothly
      setSnippets((prev) => prev.filter((s) => s._id !== snippetId));
      setTotal((t) => Math.max(0, t - 1));
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-purple-brand" />
            <span>Saved Bookmarks</span>
          </h1>
          <p className="text-xs text-vault-muted mt-1">
            Access snippets you have saved from the community for quick reference ({total} saved).
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
            placeholder="Search within your bookmarked snippets..."
          />

          <LanguageFilter
            selectedLanguage={language}
            onChange={(val) => {
              setLanguage(val);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Bookmarks Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                onBookmarkChange={handleBookmarkToggle}
                showAuthor={true}
              />
            ))}
          </div>

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
          icon={Bookmark}
          title="No bookmarked snippets yet"
          description={
            search || language !== 'all'
              ? 'No bookmarked snippets matched your filter criteria.'
              : 'Browse community snippets and click the bookmark icon to save snippets for instant offline reference.'
          }
          actionLabel="Explore Community Snippets"
          actionLink="/explore"
        />
      )}
    </DashboardLayout>
  );
};

export default Bookmarks;

