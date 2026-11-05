import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Language identifier mapping for Prism
const languageMap = {
  Java: 'java',
  Python: 'python',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  C: 'c',
  'C++': 'cpp',
  'C#': 'csharp',
  HTML: 'html',
  CSS: 'css',
  SQL: 'sql',
  PHP: 'php',
  Go: 'go',
  Rust: 'rust',
  Kotlin: 'kotlin',
  JSON: 'json',
  Bash: 'bash',
  Other: 'text'
};

export const CodeViewer = ({
  code,
  language = 'javascript',
  showLineNumbers = true,
  maxHeight = 'none',
  showCopy = true,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const prismLanguage = languageMap[language] || language.toLowerCase();

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={`relative rounded-xl border border-vault-border bg-[#0D1117] overflow-hidden group shadow-lg ${className}`}>
      {/* Code Window Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B22] border-b border-vault-border/60 text-xs">
        <div className="flex items-center gap-2">
          {/* Mac-style window dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-slate-300 font-mono font-medium">
            <Terminal className="w-3.5 h-3.5 text-purple-brand" />
            {language}
          </span>
        </div>

        {showCopy && (
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60'
            }`}
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Syntax Highlighting Container */}
      <div
        className="overflow-x-auto text-sm font-mono"
        style={{ maxHeight: maxHeight !== 'none' ? maxHeight : undefined }}
      >
        <SyntaxHighlighter
          language={prismLanguage}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}
          lineNumberStyle={{
            color: '#4B5563',
            minWidth: '2.5em',
            paddingRight: '1em',
            userSelect: 'none'
          }}
        >
          {code || '// No code provided'}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeViewer;

