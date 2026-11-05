import React from 'react';
import { Code } from 'lucide-react';

export const SUPPORTED_LANGUAGES = [
  'All',
  'Java',
  'Python',
  'JavaScript',
  'TypeScript',
  'C',
  'C++',
  'C#',
  'HTML',
  'CSS',
  'SQL',
  'PHP',
  'Go',
  'Rust',
  'Kotlin',
  'JSON',
  'Bash',
  'Other'
];

export const LanguageFilter = ({ selectedLanguage, onChange }) => {
  return (
    <div className="relative inline-block w-full sm:w-auto">
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Filter by programming language"
          className="appearance-none w-full sm:w-48 bg-vault-card border border-vault-border rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-200 focus:outline-none focus:border-purple-brand focus:ring-1 focus:ring-purple-brand transition cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang} value={lang === 'All' ? 'all' : lang} className="bg-slate-900 text-white">
              {lang === 'All' ? 'All Languages' : lang}
            </option>
          ))}
        </select>
        <Code className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

export default LanguageFilter;

