import React, { useState } from 'react';
import { 
  FileText, 
  History, 
  BookOpen, 
  MessageSquare, 
  Copy, 
  Check, 
  Tag, 
  Clock, 
  Award,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Sparkles,
  ExternalLink,
  Code,
  Lock,
  Unlock,
  Coins,
  AlertCircle
} from 'lucide-react';

export default function ProblemPane({ 
  problem, 
  submissions = [], 
  onViewSubmissionCode,
  onOpenDoubtModal,
  user,
  onUnlockHint
}) {
  const [activeTab, setActiveTab] = useState('problem');
  const [copiedId, setCopiedId] = useState(null);
  const [expandedHints, setExpandedHints] = useState({});
  const [unlockingIdx, setUnlockingIdx] = useState(null);
  const [hintError, setHintError] = useState('');

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleHint = (idx) => {
    setExpandedHints(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleUnlockClick = async (idx) => {
    if (!onUnlockHint || !problem) return;
    setUnlockingIdx(idx);
    setHintError('');

    try {
      await onUnlockHint(problem.id, idx, 25);
      setExpandedHints(prev => ({ ...prev, [idx]: true }));
    } catch (err) {
      setHintError(err.message || 'Failed to unlock hint.');
    } finally {
      setUnlockingIdx(null);
    }
  };

  if (!problem) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Loading problem details...
      </div>
    );
  }

  const difficultyColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  return (
    <div className="flex flex-col h-full bg-[#12161f] border-r border-[#202735] overflow-hidden select-text">
      {/* Tab Navigation */}
      <div className="flex items-center px-2 bg-[#10141c] border-b border-[#1f2633] text-xs">
        <button
          onClick={() => setActiveTab('problem')}
          className={`flex items-center space-x-1.5 py-3 px-3.5 border-b-2 font-medium transition-colors ${
            activeTab === 'problem'
              ? 'border-blue-500 text-blue-400 bg-[#161c28]/50'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#161c28]/30'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Problem</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center space-x-1.5 py-3 px-3.5 border-b-2 font-medium transition-colors ${
            activeTab === 'submissions'
              ? 'border-blue-500 text-blue-400 bg-[#161c28]/50'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#161c28]/30'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Submissions</span>
          {submissions.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/20 text-blue-300 font-bold">
              {submissions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('hints')}
          className={`flex items-center space-x-1.5 py-3 px-3.5 border-b-2 font-medium transition-colors ${
            activeTab === 'hints'
              ? 'border-blue-500 text-blue-400 bg-[#161c28]/50'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#161c28]/30'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Hints & Editorial</span>
        </button>

        <button
          onClick={() => setActiveTab('discussion')}
          className={`flex items-center space-x-1.5 py-3 px-3.5 border-b-2 font-medium transition-colors ${
            activeTab === 'discussion'
              ? 'border-blue-500 text-blue-400 bg-[#161c28]/50'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#161c28]/30'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Discussion</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-5 text-gray-300 text-sm leading-relaxed space-y-6">
        {/* ================= 1. PROBLEM TAB ================= */}
        {activeTab === 'problem' && (
          <div>
            {/* Title & Difficulty Badge */}
            <div className="border-b border-[#212938] pb-4 mb-5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h1 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                  <span>{problem.title}</span>
                </h1>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyColors[problem.difficulty] || ''}`}>
                    {problem.difficulty}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {problem.score} pts
                  </span>
                </div>
              </div>

              {/* Tags & Metadata */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {problem.category && (
                  <span className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold">
                    <span>Module: {problem.category}</span>
                  </span>
                )}
                {problem.tags?.map((tag) => (
                  <span 
                    key={tag}
                    className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded bg-[#1c2331] text-gray-400 border border-[#2b3549]"
                  >
                    <Tag className="w-3 h-3 text-gray-500" />
                    <span>{tag}</span>
                  </span>
                ))}
                <span className="flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded bg-[#1c2331] text-gray-400 border border-[#2b3549]">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span>2.00s Limit</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 text-gray-300">
              <div className="whitespace-pre-line leading-relaxed text-sm">
                {problem.description}
              </div>

              {/* Problem Constraints */}
              <div className="mt-6 bg-[#161b26] border border-[#242d3d] rounded-lg p-4">
                <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Problem Constraints
                </h3>
                <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap font-medium">
                  {problem.constraints}
                </pre>
              </div>

              {/* Input Format */}
              <div className="mt-4">
                <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Input Format
                </h3>
                <p className="text-xs text-gray-300 pl-3 border-l-2 border-[#2b3549]">
                  {problem.inputFormat}
                </p>
              </div>

              {/* Output Format */}
              <div className="mt-4">
                <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Output Format
                </h3>
                <p className="text-xs text-gray-300 pl-3 border-l-2 border-[#2b3549]">
                  {problem.outputFormat}
                </p>
              </div>

              {/* Examples */}
              <div className="mt-6 space-y-4">
                <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Examples
                </h3>

                {problem.examples?.map((ex, idx) => (
                  <div key={idx} className="bg-[#161b26] border border-[#242d3d] rounded-lg p-4 space-y-3">
                    <div className="font-semibold text-xs text-blue-400">Example {idx + 1}:</div>
                    
                    {/* Example Input */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mb-1">
                        <span>Input:</span>
                        <button
                          onClick={() => handleCopy(ex.input, `in-${idx}`)}
                          className="flex items-center space-x-1 hover:text-gray-200 text-gray-500 transition-colors"
                        >
                          {copiedId === `in-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === `in-${idx}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="bg-[#0e121a] p-2.5 rounded border border-[#202737] font-mono text-xs text-emerald-400 overflow-x-auto">
                        {ex.input}
                      </div>
                    </div>

                    {/* Example Output */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mb-1">
                        <span>Output:</span>
                        <button
                          onClick={() => handleCopy(ex.output, `out-${idx}`)}
                          className="flex items-center space-x-1 hover:text-gray-200 text-gray-500 transition-colors"
                        >
                          {copiedId === `out-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === `out-${idx}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="bg-[#0e121a] p-2.5 rounded border border-[#202737] font-mono text-xs text-amber-300 overflow-x-auto">
                        {ex.output}
                      </div>
                    </div>

                    {/* Explanation */}
                    {ex.explanation && (
                      <div className="text-xs text-gray-400 pt-1 border-t border-[#212938]">
                        <span className="font-semibold text-gray-300">Explanation: </span>
                        <span className="whitespace-pre-line">{ex.explanation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* AlgoForge Doubt Callout */}
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-800/40 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-300 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Stuck on this problem?
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Request 1-on-1 mentor support or ask your doubt for instant algorithmic help.
                  </p>
                </div>
                <button
                  onClick={onOpenDoubtModal}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-900/40 transition-all shrink-0 ml-3"
                >
                  Raise Doubt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. SUBMISSIONS TAB ================= */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#212938] pb-3">
              <h2 className="text-sm font-semibold text-gray-200">
                Your Submission History
              </h2>
              <span className="text-xs text-gray-400">
                Total Submissions: {submissions.length}
              </span>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                <History className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p>No submissions recorded yet for this problem.</p>
                <p className="mt-1 text-gray-600">Click "Submit" in the code editor to evaluate your solution.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {submissions.map((sub, idx) => {
                  const isAccepted = sub.verdict === 'Accepted';
                  return (
                    <div 
                      key={sub.id || idx}
                      className="p-3.5 rounded-lg bg-[#161b26] border border-[#242d3d] hover:border-[#323d53] transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            isAccepted 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {sub.verdict}
                          </span>
                          <span className="text-xs text-gray-400 uppercase font-mono font-medium">
                            {sub.language}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500">
                          {new Date(sub.submittedAt).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 bg-[#0e121a] p-2 rounded border border-[#202737]">
                        <div>
                          <span className="text-gray-500 block text-[10px]">Test Cases</span>
                          <span className="font-semibold text-gray-300">
                            {sub.passedCount} / {sub.totalCount} ({sub.passPercentage}%)
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[10px]">Runtime</span>
                          <span className="font-semibold text-gray-300">{sub.totalRuntimeMs} ms</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[10px]">Memory</span>
                          <span className="font-semibold text-gray-300">{sub.memoryMb}</span>
                        </div>
                      </div>

                      {onViewSubmissionCode && (
                        <div className="mt-2 text-right">
                          <button
                            onClick={() => onViewSubmissionCode(sub)}
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center justify-end gap-1 ml-auto font-medium"
                          >
                            <Code className="w-3.5 h-3.5" />
                            <span>View Submitted Code</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= 3. HINTS & EDITORIAL TAB ================= */}
        {activeTab === 'hints' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-[#212938] pb-2.5">
                <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Problem Hints
                </h2>

                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-[#161c28] border border-[#252f42] text-amber-300">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Balance: <strong>{user?.points || 0} pts</strong></span>
                </div>
              </div>

              {hintError && (
                <div className="mb-3 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{hintError}</span>
                </div>
              )}

              <div className="space-y-3">
                {problem.hints?.map((hint, idx) => {
                  const isUnlocked = user?.unlockedHints?.[problem.id]?.includes(idx);
                  const isExpanded = expandedHints[idx];
                  const isUnlockingThis = unlockingIdx === idx;

                  return (
                    <div 
                      key={idx}
                      className={`border rounded-lg overflow-hidden transition-all ${
                        isUnlocked 
                          ? 'border-[#252f42] bg-[#161c28]' 
                          : 'border-[#2c2225] bg-[#1a1417]/60'
                      }`}
                    >
                      {isUnlocked ? (
                        /* Unlocked Hint View */
                        <div>
                          <button
                            onClick={() => toggleHint(idx)}
                            className="w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between text-gray-300 hover:bg-[#1a2233] transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="font-semibold text-gray-200">Hint {idx + 1}</span>
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                                Unlocked
                              </span>
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="px-3.5 py-2.5 bg-[#0e121a] text-xs text-gray-300 border-t border-[#202737] leading-relaxed">
                              {hint}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Locked Hint View */
                        <div className="p-3.5 flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                              <Lock className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-xs text-gray-200 flex items-center gap-2">
                                <span>Hint {idx + 1}</span>
                                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/25">
                                  25 pts
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500">
                                Unlock algorithmic guidance for this problem without penalty.
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleUnlockClick(idx)}
                            disabled={isUnlockingThis}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs shadow-md shadow-amber-950/40 transition-all flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            <span>{isUnlockingThis ? 'Unlocking...' : 'Unlock (25 pts)'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Editorial Solution Approach */}
            <div className="border-t border-[#212938] pt-5">
              <h2 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-400" />
                Official Editorial
              </h2>
              <div className="bg-[#161c28] border border-[#252f42] rounded-lg p-4 text-xs text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">
                {problem.editorial}
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. DISCUSSION TAB ================= */}
        {activeTab === 'discussion' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#212938] pb-3">
              <h2 className="text-sm font-semibold text-gray-200">
                Community Discussion & Doubts
              </h2>
              <button 
                onClick={onOpenDoubtModal}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded"
              >
                + New Post
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#161c28] border border-[#252f42] rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-blue-400">Rahul Sharma (Mentee)</span>
                  <span className="text-[10px] text-gray-500">2 hours ago</span>
                </div>
                <p className="text-xs text-gray-300">
                  Can we solve this using a Monotonic Stack instead of Two Pointers? What would be the space complexity in that case?
                </p>
                <div className="mt-2.5 pl-3 border-l-2 border-emerald-500 text-xs bg-[#0f141e] p-2 rounded">
                  <span className="font-semibold text-emerald-400 text-[11px] block">AlgoForge Mentor (TA):</span>
                  <p className="text-gray-300 mt-0.5">
                    Yes! A monotonic decreasing stack stores indices. When you encounter a bar taller than the stack top, you pop and calculate trapped water bounded between current bar and the new stack top. Space complexity is O(N).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#161c28] border border-[#252f42] rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-purple-400">Ananya Verma (Mentee)</span>
                  <span className="text-[10px] text-gray-500">Yesterday</span>
                </div>
                <p className="text-xs text-gray-300">
                  Got Time Limit Exceeded initially with the O(N^2) brute force. The two-pointer approach passed all 12 test cases in 0.08 ms!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

