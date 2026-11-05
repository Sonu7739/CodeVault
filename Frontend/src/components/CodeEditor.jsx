import React, { useState } from 'react';
import CodeViewer from './CodeViewer';
import { Eye, Edit3, Code2 } from 'lucide-react';

export const CodeEditor = ({
  code,
  onChange,
  language = 'JavaScript',
  placeholder = '// Enter your code snippet here...\nfunction example() {\n  return "Hello, CodeVault!";\n}'
}) => {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview' | 'split'

  const handleKeyDown = (e) => {
    // Handle tab key indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const spaces = '  ';

      const newCode = code.substring(0, start) + spaces + code.substring(end);
      onChange(newCode);

      // Reset caret position after react re-render
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  const lineCount = (code || '').split('\n').length;
  const charCount = (code || '').length;

  return (
    <div className="border border-vault-border rounded-xl bg-vault-card overflow-hidden">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-vault-border">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-purple-brand" />
          <span className="text-xs font-medium text-slate-300">Code Editor</span>
          <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
            {language}
          </span>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-vault-border text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
              activeTab === 'editor'
                ? 'bg-purple-brand text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
              activeTab === 'preview'
                ? 'bg-purple-brand text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === 'editor' ? (
        <div className="relative flex bg-[#0D1117]">
          {/* Line Numbers Gutter */}
          <div className="py-4 px-3 bg-[#090D14] border-r border-vault-border text-right select-none font-mono text-xs text-slate-600 w-12 shrink-0 leading-6">
            {Array.from({ length: Math.max(lineCount, 8) }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={12}
            spellCheck="false"
            className="w-full bg-transparent p-4 font-mono text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-y leading-6 selection:bg-purple-500/30 selection:text-white"
          />
        </div>
      ) : (
        <div className="p-4 bg-slate-950/60">
          <CodeViewer code={code} language={language} showLineNumbers={true} showCopy={false} />
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-t border-vault-border text-xs text-vault-subtle font-mono">
        <div>
          {lineCount} {lineCount === 1 ? 'line' : 'lines'}, {charCount} characters
        </div>
        <div className="text-[11px] text-slate-500">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Tab</kbd> to indent
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

