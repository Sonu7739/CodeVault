import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Code2,
  Heart,
  Bookmark,
  Share2,
  Copy,
  Check,
  Calendar,
  Lock,
  Globe,
  Edit2,
  Trash2,
  User,
  ShieldAlert,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import CodeViewer from '../components/CodeViewer';
import SnippetCard from '../components/SnippetCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { snippetService } from '../services/snippetService';
import { bookmarkService } from '../services/bookmarkService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SnippetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();

  const [snippet, setSnippet] = useState(null);
  const [relatedSnippets, setRelatedSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Interaction states
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        setIsLoading(true);
        setPermissionDenied(false);
        const res = await snippetService.getSnippetById(id);
        if (res.success && res.snippet) {
          setSnippet(res.snippet);
          setLikesCount(res.snippet.likesCount || 0);
          setIsLiked(res.snippet.isLiked || false);
          setIsBookmarked(res.snippet.isBookmarked || false);
          setRelatedSnippets(res.relatedSnippets || []);
        }
      } catch (err) {
        if (err.response?.status === 403) {
          setPermissionDenied(true);
        } else {
          error(err.response?.data?.message || 'Snippet not found');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippet();
  }, [id, error]);

  const handleCopyCode = async () => {
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopiedCode(true);
      success('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      error('Failed to copy code');
    }
  };

  const handleShareUrl = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      success('Snippet URL copied to clipboard!');
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      info(`Share URL: ${url}`);
    }
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      info('Please log in to like this snippet');
      return;
    }
    if (isLiking || !snippet) return;

    try {
      setIsLiking(true);
      const res = await snippetService.toggleLike(snippet._id);
      setIsLiked(res.isLiked);
      setLikesCount(res.likesCount);
      if (res.isLiked) {
        success('Liked this snippet!');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Error updating like');
    } finally {
      setIsLiking(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      info('Please log in to bookmark snippets');
      return;
    }
    if (isBookmarking || !snippet) return;

    try {
      setIsBookmarking(true);
      if (isBookmarked) {
        await bookmarkService.removeBookmark(snippet._id);
        setIsBookmarked(false);
        success('Removed from your bookmarks');
      } else {
        await bookmarkService.addBookmark(snippet._id);
        setIsBookmarked(true);
        success('Snippet saved to your bookmarks!');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Error updating bookmark');
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleDelete = async () => {
    if (!snippet) return;
    try {
      setIsDeleting(true);
      await snippetService.deleteSnippet(snippet._id);
      success('Snippet deleted permanently');
      navigate('/my-snippets');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete snippet');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Loading snippet details..." />
      </DashboardLayout>
    );
  }

  if (permissionDenied) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto my-16 text-center p-8 bg-vault-card border border-rose-500/30 rounded-2xl shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Private Snippet</h2>
          <p className="text-sm text-vault-muted mb-6 leading-relaxed">
            This snippet has been configured as private by its author. Only the snippet owner has permission to view it.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-brand hover:bg-purple-brand-hover text-white text-sm font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Community Snippets</span>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (!snippet) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-white mb-2">Snippet Not Found</h2>
          <p className="text-sm text-vault-muted mb-6">The requested snippet could not be located or has been deleted.</p>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-purple-brand hover:bg-purple-brand-hover text-white text-sm font-semibold transition"
          >
            Browse Explore
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isOwner =
    user && snippet.userId && (snippet.userId._id || snippet.userId).toString() === user._id.toString();

  const authorName = snippet.userId?.username || 'developer';
  const authorInitials = authorName.slice(0, 2).toUpperCase();
  const formattedDate = new Date(snippet.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <DashboardLayout>
      {/* Top Breadcrumb & Nav */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to={isOwner ? '/my-snippets' : '/explore'}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isOwner ? 'Back to My Snippets' : 'Back to Explore'}</span>
        </Link>

        {isOwner && (
          <div className="flex items-center gap-2">
            <Link
              to={`/snippets/edit/${snippet._id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-vault-border text-xs font-medium text-slate-200 transition"
            >
              <Edit2 className="w-3.5 h-3.5 text-purple-brand" />
              <span>Edit</span>
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-medium text-rose-300 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Snippet Container */}
      <div className="bg-vault-card border border-vault-border rounded-2xl p-6 md:p-8 space-y-6 shadow-card mb-10">
        {/* Header Information */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-vault-border">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs px-3 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono font-medium">
                {snippet.language}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 border font-medium ${
                  snippet.visibility === 'private'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                }`}
              >
                {snippet.visibility === 'private' ? (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Private Vault
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" /> Public Community
                  </>
                )}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {snippet.title}
            </h1>

            {snippet.description && (
              <p className="text-sm text-vault-muted leading-relaxed">
                {snippet.description}
              </p>
            )}

            {/* Author & Date metadata */}
            <div className="flex items-center gap-4 text-xs text-vault-subtle pt-1">
              <Link
                to={`/profile/${authorName}`}
                className="flex items-center gap-2 hover:text-white transition group"
              >
                <div className="w-6 h-6 rounded-full bg-purple-brand/20 border border-purple-brand/40 flex items-center justify-center text-[10px] font-bold text-purple-300">
                  {authorInitials}
                </div>
                <span className="font-medium text-slate-300 group-hover:text-purple-brand transition">
                  {authorName}
                </span>
              </Link>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 self-start">
            {/* Copy Code */}
            <button
              onClick={handleCopyCode}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                copiedCode
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 border-vault-border text-slate-200 hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>

            {/* Share URL */}
            <button
              onClick={handleShareUrl}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                copiedUrl
                  ? 'bg-purple-brand/20 text-purple-300 border-purple-brand/40'
                  : 'bg-slate-900 border-vault-border text-slate-200 hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              {copiedUrl ? <Check className="w-4 h-4 text-purple-400" /> : <Share2 className="w-4 h-4 text-slate-400" />}
              <span>{copiedUrl ? 'Link Copied!' : 'Share URL'}</span>
            </button>

            {/* Like */}
            <button
              onClick={handleToggleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                isLiked
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900 border-vault-border text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>{likesCount}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={handleToggleBookmark}
              disabled={isBookmarking}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                isBookmarked
                  ? 'bg-purple-brand/20 text-purple-300 border-purple-brand/40'
                  : 'bg-slate-900 border-vault-border text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-purple-brand text-purple-brand' : 'text-slate-400'}`} />
              <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>
          </div>
        </div>

        {/* Full Syntax Highlighted Code Viewer */}
        <div>
          <CodeViewer
            code={snippet.code}
            language={snippet.language}
            showLineNumbers={true}
            showCopy={true}
          />
        </div>

        {/* Tags */}
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="pt-4 border-t border-vault-border flex items-center gap-2 flex-wrap">
            <span className="text-xs text-vault-subtle font-medium">Tags:</span>
            {snippet.tags.map((t, idx) => (
              <Link
                key={idx}
                to={`/explore?tag=${t}`}
                className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-vault-border hover:border-purple-brand/50 hover:text-purple-300 text-slate-300 transition"
              >
                #{t}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Related Public Snippets Section */}
      {relatedSnippets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-brand" />
            <h2 className="text-base font-semibold text-white">Related Snippets</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedSnippets.map((rel) => (
              <SnippetCard key={rel._id} snippet={rel} showAuthor={true} />
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Delete Snippet"
        message={`Are you sure you want to permanently delete "${snippet.title}"?`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </DashboardLayout>
  );
};

export default SnippetDetails;

