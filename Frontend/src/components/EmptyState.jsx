import React from 'react';
import { Code2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Code2,
  title = 'No snippets found',
  description = 'Start your collection by creating your first code snippet.',
  actionLabel = 'Create Snippet',
  actionLink = '/snippets/new',
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-vault-card/40 border border-dashed border-vault-border rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-purple-brand/10 border border-purple-brand/20 flex items-center justify-center text-purple-brand mb-4 shadow-glow-purple">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-vault-muted max-w-md mb-6">{description}</p>
      {actionLabel && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-brand hover:bg-purple-brand-hover text-white text-sm font-medium transition shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-brand hover:bg-purple-brand-hover text-white text-sm font-medium transition shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;

