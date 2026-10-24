import React, { useState } from 'react';
import { X, Copy, Check, Code } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function SubmissionModal({ submission, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!submission) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(submission.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl h-[80vh] flex flex-col bg-[#151a24] border border-[#2b3547] rounded-xl shadow-2xl overflow-hidden text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#10141c] border-b border-[#222a38]">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              submission.verdict === 'Accepted'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {submission.verdict}
            </span>
            <span className="text-xs text-gray-400 uppercase font-mono font-medium">
              {submission.language}
            </span>
            <span className="text-xs text-gray-500">
              ({submission.passedCount}/{submission.totalCount} Test cases passed)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#1a202c] hover:bg-[#222a3a] border border-[#2d3748] text-xs text-gray-300"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 p-1 rounded-lg hover:bg-[#1f2634] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Canvas */}
        <div className="flex-1 w-full relative">
          <Editor
            height="100%"
            language={submission.language === 'python' ? 'python' : 'javascript'}
            value={submission.code}
            theme="vs-dark"
            options={{
              readOnly: true,
              fontSize: 13,
              fontFamily: "Fira Code, Menlo, Monaco, Consolas, monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: 'on',
              folding: true
            }}
          />
        </div>
      </div>
    </div>
  );
}

