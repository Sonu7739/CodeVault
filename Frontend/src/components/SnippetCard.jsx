import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Bookmark,
  Copy,
  Check,
  Eye,
  Lock,
  Globe,
  Edit2,
  Trash2,
  Calendar,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { snippetService } from '../services/snippetService';
import { bookmarkService } from '../services/bookmarkService';

// Language badge colors
const languageColors = {
  Java: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Python: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  JavaScript: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  TypeScript: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  C: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'C++': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'C#': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  HTML: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  CSS: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  SQL: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PHP: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Go: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  Rust: 'bg-red-500/10 text-red-400 border-red-500/20',
  Kotlin: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  JSON: 'bg-lime-500/10 text-lime-400 border-lime-500/20',
  Bash: 'bg-gray-500/10 text-gray-300 border-gray-500/20',
  Other: 'bg-slate-500/10 text-slate-300 border-slate-500/20'
};

export const SnippetCard = ({
  snippet,
  onDelete,
  onBookmarkChange,
  showAuthor = true
}) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();

  const [copied, setCopied] = useState(false);
  const [likesCount, setLikesCount] = useState(
    snippet.likesCount !== undefined ? snippet.likesCount : (snippet.likes || []).length
  );
  const [isLiked, setIsLiked] = useState(
    snippet.isLiked ||
      (user && snippet.likes && snippet.likes.some((id) => (id._id || id).toString() === user._id.toString()))
  );
  const [isBookmarked, setIsBookmarked] = useState(snippet.isBookmarked || false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const isOwner =
    user && snippet.userId && (snippet.userId._id || snippet.userId).toString() === user._id.toString();

  const authorName = snippet.userId?.username || 'developer';
  const authorInitials = authorName.slice(0, 2).toUpperCase();

  const handleCopyCode = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      error('Failed to copy code');
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/snippets/${snippet._id}`;
    try {
      await navigator.clipboard.writeText(url);
      success('Snippet share URL copied to clipboard!');
    } catch {
      info(`Share URL: ${url}`);
    }
  };

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      info('Please log in to like snippets');
      return;
    }
    if (isLiking) return;

    try {
      setIsLiking(true);
      const res = await snippetService.toggleLike(snippet._id);
      setIsLiked(res.isLiked);
      setLikesCount(res.likesCount);
    } catch (err) {
      error(err.response?.data?.message || 'Error updating like');
    } finally {
      setIsLiking(false);
    }
  };

  const handleToggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      info('Please log in to bookmark snippets');
      return;
    }
    if (isBookmarking) return;

    try {
      setIsBookmarking(true);
      if (isBookmarked) {
        await bookmarkService.removeBookmark(snippet._id);
        setIsBookmarked(false);
        success('Removed from bookmarks');
        if (onBookmarkChange) onBookmarkChange(snippet._id, false);
      } else {
        await bookmarkService.addBookmark(snippet._id);
        setIsBookmarked(true);
        success('Saved to bookmarks');
        if (onBookmarkChange) onBookmarkChange(snippet._id, true);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Error updating bookmark');
    } finally {
      setIsBookmarking(false);
    }
  };

  // Preview code (first 4 lines)
  const codeLines = (snippet.code || '').split('\n').slice(0, 4).join('\n');

  const langStyle =
    languageColors[snippet.language] ||
    'bg-purple-500/10 text-purple-300 border-purple-500/20';

  const formattedDate = snippet.createdAt
    ? new Date(snippet.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <div className="group bg-vault-card border border-vault-border rounded-xl p-5 hover:border-vault-border-light hover:bg-vault-card-hover transition-all duration-200 flex flex-col justify-between shadow-card relative">
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-md border font-mono font-medium ${langStyle}`}>
              {snippet.language}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 border ${
                snippet.visibility === 'private'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              {snippet.visibility === 'private' ? (
                <>
                  <Lock className="w-2.5 h-2.5" /> Private
                </>
              ) : (
                <>
                  <Globe className="w-2.5 h-2.5" /> Public
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              title="Share snippet"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyCode}
              title="Copy code"
              className={`p-1.5 rounded-lg transition ${
                copied
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            {isOwner && (
              <>
                <Link
                  to={`/snippets/edit/${snippet._id}`}
                  title="Edit snippet"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(snippet);
                    }}
                    title="Delete snippet"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <Link to={`/snippets/${snippet._id}`} className="block group/link">
          <h3 className="text-base font-semibold text-white group-hover/link:text-purple-brand transition line-clamp-1 mb-1">
            {snippet.title}
          </h3>
        </Link>

        {/* Description */}
        {snippet.description && (
          <p className="text-xs text-vault-muted line-clamp-2 mb-3 leading-relaxed">
            {snippet.description}
          </p>
        )}

        {/* Code Preview snippet */}
        <Link
          to={`/snippets/${snippet._id}`}
          className="block my-3 bg-[#0A0E17] border border-vault-border/70 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-hidden relative group/code hover:border-purple-brand/40 transition"
        >
          <pre className="overflow-hidden text-[11px] leading-relaxed max-h-20">
            <code>{codeLines}</code>
          </pre>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-transparent to-transparent pointer-events-none"></div>
          <span className="absolute bottom-2 right-2 text-[10px] text-purple-400 bg-slate-900/90 px-2 py-0.5 rounded border border-purple-500/20 flex items-center gap-1 font-sans">
            <Eye className="w-3 h-3" /> View Code
          </span>
        </Link>

        {/* Tags */}
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 my-2">
            {snippet.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50"
              >
                #{tag}
              </span>
            ))}
            {snippet.tags.length > 4 && (
              <span className="text-[11px] px-1.5 py-0.5 text-slate-500">
                +{snippet.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Meta: Author, Date, Likes, Bookmark */}
      <div className="pt-3 mt-2 border-t border-vault-border flex items-center justify-between text-xs text-vault-subtle">
        {showAuthor ? (
          <Link
            to={`/profile/${authorName}`}
            className="flex items-center gap-2 hover:text-white transition group/author"
          >
            <div className="w-6 h-6 rounded-full bg-purple-brand/20 border border-purple-brand/30 flex items-center justify-center text-[10px] font-bold text-purple-300 group-hover/author:border-purple-brand">
              {authorInitials}
            </div>
            <span className="font-medium text-slate-300 group-hover/author:text-white">
              {authorName}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        )}

        {/* Interactions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 transition ${
              isLiked
                ? 'text-rose-400 font-semibold'
                : 'text-slate-400 hover:text-rose-400'
            }`}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
            />
            <span className="text-xs">{likesCount}</span>
          </button>

          <button
            onClick={handleToggleBookmark}
            disabled={isBookmarking}
            className={`transition ${
              isBookmarked
                ? 'text-purple-brand font-semibold'
                : 'text-slate-400 hover:text-purple-brand'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? 'fill-purple-brand text-purple-brand' : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnippetCard;

