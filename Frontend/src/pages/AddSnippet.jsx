import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Code2,
  Save,
  ArrowLeft,
  Loader2,
  Globe,
  Lock,
  Tag,
  FileText
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import CodeEditor from '../components/CodeEditor';
import { snippetService } from '../services/snippetService';
import { useToast } from '../context/ToastContext';
import { SUPPORTED_LANGUAGES } from '../components/LanguageFilter';

const LANGUAGES = SUPPORTED_LANGUAGES.filter((l) => l !== 'All');

export const AddSnippet = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError('Snippet title is required');
      return;
    }

    if (!code.trim()) {
      setFormError('Please enter some code for your snippet');
      return;
    }

    try {
      setIsLoading(true);
      setFormError('');

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0);

      const res = await snippetService.createSnippet({
        title: title.trim(),
        description: description.trim(),
        language,
        code,
        tags,
        visibility
      });

      if (res.success && res.snippet) {
        success('Snippet created and stored in your vault!');
        navigate(`/snippets/${res.snippet._id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save snippet';
      setFormError(msg);
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/my-snippets"
            className="p-2 rounded-xl bg-vault-card border border-vault-border text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Back to My Snippets"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Code2 className="w-6 h-6 text-purple-brand" />
              <span>Create New Snippet</span>
            </h1>
            <p className="text-xs text-vault-muted mt-0.5">
              Save a frequently used snippet with syntax highlighting and tags.
            </p>
          </div>
        </div>
      </div>

      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {formError}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-vault-card border border-vault-border rounded-2xl p-5 md:p-7 space-y-6 shadow-card">
          {/* Title & Language Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Snippet Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Debounced API Search Hook"
                className="w-full bg-slate-900 border border-vault-border rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-brand focus:ring-1 focus:ring-purple-brand transition"
              />
            </div>

            <div>
              <label htmlFor="language" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Programming Language *
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-900 border border-vault-border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-brand transition cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-slate-900 text-white">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Description (Optional)
            </label>
            <div className="relative">
              <textarea
                id="description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief explanation of what this snippet does, runtime complexity, or how to use it..."
                className="w-full bg-slate-900 border border-vault-border rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-brand transition resize-none"
              />
            </div>
          </div>

          {/* Code Editor */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Code *
            </label>
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              placeholder={`// Write or paste your ${language} code snippet here...\n`}
            />
          </div>

          {/* Tags & Visibility Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-vault-border">
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Tags (Comma Separated)
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="tags"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. react, hooks, debouncing, performance"
                  className="w-full bg-slate-900 border border-vault-border rounded-xl py-2.5 pl-10 pr-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-brand transition"
                />
              </div>
              <p className="text-[11px] text-vault-subtle mt-1.5">
                Tags help you and the community filter and discover snippets quickly.
              </p>
            </div>

            {/* Visibility Option */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Visibility Setting
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVisibility('public')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition ${
                    visibility === 'public'
                      ? 'bg-purple-brand/15 border-purple-brand text-purple-300 shadow-sm'
                      : 'bg-slate-900 border-vault-border text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <div className="font-semibold text-white">Public</div>
                    <div className="text-[10px] text-slate-400">Share with community</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility('private')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition ${
                    visibility === 'private'
                      ? 'bg-purple-brand/15 border-purple-brand text-purple-300 shadow-sm'
                      : 'bg-slate-900 border-vault-border text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <div className="font-semibold text-white">Private</div>
                    <div className="text-[10px] text-slate-400">Visible only to you</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            to="/my-snippets"
            className="px-5 py-2.5 rounded-xl border border-vault-border text-slate-300 hover:bg-slate-800 text-sm font-medium transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-brand hover:bg-purple-brand-hover text-white text-sm font-semibold transition shadow-glow-purple disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Vault...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Snippet</span>
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default AddSnippet;

