import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  RotateCcw, 
  Copy, 
  Check, 
  Settings, 
  Code2, 
  Maximize2, 
  Minimize2,
  ChevronDown
} from 'lucide-react';

const LANGUAGE_MAP = {
  python: 'python',
  javascript: 'javascript',
  cpp: 'cpp'
};

const LANGUAGE_LABELS = {
  python: 'Python 3',
  javascript: 'JavaScript (Node.js)',
  cpp: 'C++ (g++ 13)'
};

export default function EditorPane({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onResetCode,
  isFullScreen,
  onToggleFullScreen
}) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('vs-dark');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditorChange = (value) => {
    onCodeChange(value || '');
  };

  return (
    <div className="flex flex-col h-full bg-[#12161f] overflow-hidden select-none">
      {/* Top Editor Toolbar */}
      <div className="h-10 bg-[#10141c] border-b border-[#1f2633] px-3 flex items-center justify-between text-xs">
        {/* Left: Language Selector */}
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-[#181f2c] border border-[#273245] rounded px-2.5 py-1 text-xs text-gray-200 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="python">Python 3</option>
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="cpp">C++ (g++ 13)</option>
            </select>
          </div>
        </div>

        {/* Right: Settings, Font size, Reset, Copy, Fullscreen */}
        <div className="flex items-center space-x-2">
          {/* Font Size Selector */}
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="bg-[#181f2c] border border-[#273245] rounded px-2 py-1 text-[11px] text-gray-300 focus:outline-none cursor-pointer"
            title="Font Size"
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
          </select>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-[#181f2c] hover:bg-[#20293b] border border-[#273245] text-gray-300 text-[11px] transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Reset to Starter Code */}
          <button
            onClick={onResetCode}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-[#181f2c] hover:bg-[#20293b] border border-[#273245] text-gray-300 text-[11px] transition-colors"
            title="Reset to starter boilerplate"
          >
            <RotateCcw className="w-3 h-3 text-gray-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Fullscreen toggle */}
          {onToggleFullScreen && (
            <button
              onClick={onToggleFullScreen}
              className="p-1 rounded bg-[#181f2c] hover:bg-[#20293b] border border-[#273245] text-gray-300 transition-colors"
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 w-full h-full relative">
        <Editor
          height="100%"
          language={LANGUAGE_MAP[language] || 'python'}
          value={code}
          theme={theme}
          onChange={handleEditorChange}
          options={{
            fontSize: fontSize,
            fontFamily: "Fira Code, Menlo, Monaco, Consolas, 'Courier New', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            lineNumbers: 'on',
            lineDecorationsWidth: 10,
            glyphMargin: false,
            folding: true,
            suggestOnTriggerCharacters: true,
            renderLineHighlight: 'all',
            padding: { top: 12, bottom: 12 }
          }}
          loading={
            <div className="flex items-center justify-center h-full text-xs text-gray-500">
              Loading code editor...
            </div>
          }
        />
      </div>
    </div>
  );
}

