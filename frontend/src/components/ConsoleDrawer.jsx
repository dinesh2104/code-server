import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Terminal, 
  ChevronUp, 
  ChevronDown,
  Loader2,
  Sparkles,
  Layers,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ConsoleDrawer({
  sampleTestCases = [],
  customInput,
  onCustomInputChange,
  useCustomInput,
  onToggleCustomInput,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
  runResult,
  submissionResult,
  isDrawerExpanded,
  onToggleDrawer
}) {
  const [activeTab, setActiveTab] = useState('testcases');
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);

  // Trigger confetti when submission is Accepted
  useEffect(() => {
    if (submissionResult && submissionResult.verdict === 'Accepted') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setActiveTab('submission');
    } else if (submissionResult) {
      setActiveTab('submission');
    }
  }, [submissionResult]);

  useEffect(() => {
    if (runResult) {
      setActiveTab('runResult');
    }
  }, [runResult]);

  return (
    <div className="flex flex-col bg-[#12161f] border-t border-[#1f2633] z-10">
      {/* Drawer Header & Tabs */}
      <div className="h-10 bg-[#10141c] border-b border-[#1f2633] px-3 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              setActiveTab('testcases');
              if (!isDrawerExpanded) onToggleDrawer(true);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-t font-medium transition-colors ${
              activeTab === 'testcases'
                ? 'bg-[#181f2c] text-blue-400 border-t-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Test Cases</span>
          </button>

          {useCustomInput && (
            <button
              onClick={() => {
                setActiveTab('customInput');
                if (!isDrawerExpanded) onToggleDrawer(true);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-t font-medium transition-colors ${
                activeTab === 'customInput'
                  ? 'bg-[#181f2c] text-blue-400 border-t-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Custom Input</span>
            </button>
          )}

          {runResult && (
            <button
              onClick={() => {
                setActiveTab('runResult');
                if (!isDrawerExpanded) onToggleDrawer(true);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-t font-medium transition-colors ${
                activeTab === 'runResult'
                  ? 'bg-[#181f2c] text-cyan-400 border-t-2 border-cyan-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run Output</span>
            </button>
          )}

          {submissionResult && (
            <button
              onClick={() => {
                setActiveTab('submission');
                if (!isDrawerExpanded) onToggleDrawer(true);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-t font-medium transition-colors ${
                activeTab === 'submission'
                  ? 'bg-[#181f2c] text-emerald-400 border-t-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Submission Verdict</span>
            </button>
          )}
        </div>

        {/* Expand / Collapse Console Button */}
        <button
          onClick={() => onToggleDrawer(!isDrawerExpanded)}
          className="flex items-center space-x-1 text-gray-400 hover:text-gray-200 px-2 py-1 rounded hover:bg-[#181f2c] transition-colors"
        >
          <span>Console</span>
          {isDrawerExpanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Drawer Body (Visible when expanded) */}
      {isDrawerExpanded && (
        <div className="h-60 overflow-y-auto p-4 bg-[#0f131a] text-xs font-mono">
          {/* TAB 1: Test Cases */}
          {activeTab === 'testcases' && (
            <div className="space-y-3 font-sans">
              <div className="flex items-center space-x-2 border-b border-[#202737] pb-2">
                {sampleTestCases.map((tc, idx) => (
                  <button
                    key={tc.id}
                    onClick={() => setSelectedTestCaseIdx(idx)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                      selectedTestCaseIdx === idx
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-[#1a2232] text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>

              {sampleTestCases[selectedTestCaseIdx] && (
                <div className="space-y-3 pt-1">
                  <div>
                    <span className="text-[11px] text-gray-400 font-medium font-sans">Input:</span>
                    <div className="mt-1 p-2.5 rounded bg-[#161c28] border border-[#252f42] text-emerald-400 font-mono text-xs overflow-x-auto">
                      {sampleTestCases[selectedTestCaseIdx].input}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-gray-400 font-medium font-sans">Expected Output:</span>
                    <div className="mt-1 p-2.5 rounded bg-[#161c28] border border-[#252f42] text-amber-300 font-mono text-xs overflow-x-auto">
                      {sampleTestCases[selectedTestCaseIdx].expectedOutput}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Custom Input */}
          {activeTab === 'customInput' && (
            <div className="space-y-2 font-sans">
              <label className="text-[11px] text-gray-400 font-medium">
                Enter your custom arguments (e.g. array, number):
              </label>
              <textarea
                value={customInput}
                onChange={(e) => onCustomInputChange(e.target.value)}
                rows={5}
                placeholder="[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]"
                className="w-full bg-[#161c28] border border-[#252f42] rounded p-2.5 font-mono text-xs text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* TAB 3: Run Output */}
          {activeTab === 'runResult' && runResult && (
            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                  runResult.verdict === 'Passed' || runResult.verdict === 'Accepted'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {runResult.verdict}
                </span>
                <span className="text-gray-400 text-xs">
                  Runtime: <strong className="text-gray-200">{runResult.totalRuntimeMs} ms</strong>
                </span>
              </div>

              {runResult.testResults?.map((res, idx) => (
                <div key={idx} className="p-3 bg-[#161c28] border border-[#252f42] rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-300">Test Case {idx + 1}</span>
                    <span className={res.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {res.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 font-mono">
                    <div>
                      <span className="text-gray-500 font-sans">Input: </span>
                      <span className="text-emerald-400">{res.input}</span>
                    </div>
                    {res.expectedOutput !== null && (
                      <div>
                        <span className="text-gray-500 font-sans">Expected: </span>
                        <span className="text-amber-300">{res.expectedOutput}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500 font-sans">Your Output: </span>
                      <span className={res.passed ? 'text-gray-200' : 'text-rose-400 font-semibold'}>
                        {res.actualOutput || (res.error ? 'Error' : 'None')}
                      </span>
                    </div>

                    {res.userStdout && (
                      <div className="mt-2 pt-2 border-t border-[#202838]">
                        <span className="text-gray-500 font-sans text-[11px] block">Standard Output (stdout):</span>
                        <pre className="text-gray-400 text-[11px] whitespace-pre-wrap">{res.userStdout}</pre>
                      </div>
                    )}

                    {res.error && (
                      <div className="mt-2 p-2 rounded bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">
                        {res.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Submission Verdict */}
          {activeTab === 'submission' && submissionResult && (
            <div className="space-y-4 font-sans">
              {/* Verdict Header Card */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                submissionResult.verdict === 'Accepted'
                  ? 'bg-gradient-to-r from-emerald-950/50 to-green-900/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-gradient-to-r from-rose-950/50 to-red-900/30 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center space-x-3">
                  {submissionResult.verdict === 'Accepted' ? (
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-rose-400" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold tracking-wide uppercase">
                      {submissionResult.verdict}
                    </h3>
                    <p className="text-xs text-gray-300">
                      {submissionResult.verdict === 'Accepted'
                        ? `Congratulations! All ${submissionResult.totalCount} test cases passed successfully!`
                        : `Your code failed on some test cases. Review the breakdown below.`}
                    </p>
                  </div>
                </div>

                {/* Score / Status */}
                <div className="text-right">
                  <div className="text-lg font-black tracking-tight">
                    {submissionResult.passedCount} / {submissionResult.totalCount}
                  </div>
                  <div className="text-[11px] text-gray-400">Test Cases Passed</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Pass Rate</span>
                  <span className="font-semibold text-gray-200">{submissionResult.passPercentage}%</span>
                </div>
                <div className="w-full bg-[#1b2230] h-2.5 rounded-full overflow-hidden border border-[#263145]">
                  <div
                    className={`h-full transition-all duration-700 ${
                      submissionResult.passPercentage === 100
                        ? 'bg-emerald-500'
                        : submissionResult.passPercentage > 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${submissionResult.passPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#161c28] border border-[#252f42] rounded-lg p-2.5">
                  <span className="text-[10px] text-gray-500 uppercase block font-medium">Total Runtime</span>
                  <span className="text-sm font-bold text-gray-200">{submissionResult.totalRuntimeMs} ms</span>
                </div>
                <div className="bg-[#161c28] border border-[#252f42] rounded-lg p-2.5">
                  <span className="text-[10px] text-gray-500 uppercase block font-medium">Peak Memory</span>
                  <span className="text-sm font-bold text-gray-200">{submissionResult.memoryMb}</span>
                </div>
                <div className="bg-[#161c28] border border-[#252f42] rounded-lg p-2.5 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-gray-500 uppercase block font-medium">Evaluation Verdict</span>
                  <span className={`text-sm font-bold ${
                    submissionResult.verdict === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {submissionResult.verdict}
                  </span>
                </div>
              </div>

              {/* Test Case Breakdown List */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Test Case Breakdown:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {submissionResult.testResults?.map((tc, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        tc.passed
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-950/30 border-rose-500/40 text-rose-400'
                      }`}
                    >
                      <div className="text-[11px] font-semibold flex items-center justify-center gap-1">
                        {tc.passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>Case {idx + 1}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {tc.passed ? `${tc.runtimeMs}ms` : tc.status}
                      </div>
                    </div>
                  ))}
                </div>

                {/* If there was a failed test case, show details */}
                {submissionResult.testResults?.some(tc => !tc.passed) && (
                  <div className="mt-3 p-3 bg-[#161c28] border border-rose-500/30 rounded-lg space-y-2">
                    <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>Failed Test Case Details:</span>
                    </div>
                    {submissionResult.testResults
                      .filter(tc => !tc.passed)
                      .slice(0, 2)
                      .map((ftc, fIdx) => (
                        <div key={fIdx} className="text-xs space-y-1 bg-[#0f131a] p-2.5 rounded border border-[#242d3d] font-mono">
                          <div>
                            <span className="text-gray-500 font-sans">Input: </span>
                            <span className="text-emerald-400">{ftc.input}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-sans">Expected Output: </span>
                            <span className="text-amber-300">{ftc.expectedOutput}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-sans">Your Output: </span>
                            <span className="text-rose-400 font-bold">{ftc.actualOutput || 'None'}</span>
                          </div>
                          {ftc.error && (
                            <div className="text-rose-300 pt-1 text-[11px]">
                              Error: {ftc.error}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Sticky Action Bar (Compile & Run + Submit) */}
      <div className="h-14 bg-[#11141b] border-t border-[#1f2633] px-4 flex items-center justify-between select-none">
        {/* Left: Custom Input toggle */}
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={useCustomInput}
              onChange={(e) => onToggleCustomInput(e.target.checked)}
              className="rounded bg-[#1a2232] border-gray-600 text-blue-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
            />
            <span>Custom Input</span>
          </label>
        </div>

        {/* Right: Compile & Run + Submit Solutions Buttons */}
        <div className="flex items-center space-x-3">
          {/* Compile & Run */}
          <button
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#1c2331] hover:bg-[#252f42] border border-[#2f3b52] text-xs font-semibold text-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-gray-400" />
                <span>Compile & Run</span>
              </>
            )}
          </button>

          {/* Submit */}
          <button
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-900/40"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Evaluating Test Cases...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Solution</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

