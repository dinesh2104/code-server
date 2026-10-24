import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  MessageSquare, 
  Bot, 
  Send, 
  Sparkles, 
  UserCheck, 
  CheckCircle2 
} from 'lucide-react';

export default function DoubtModal({ 
  isOpen, 
  onClose, 
  problemTitle, 
  problemId 
}) {
  const [doubtType, setDoubtType] = useState('logic');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [taReply, setTaReply] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      setTaReply({
        author: 'Arjun Verma (Senior Mentor - AlgoForge)',
        time: 'Just now',
        message: `Hello! For problem #${problemId} (${problemTitle}), make sure you are not recalculating the maximum bar at every iteration (which would be O(N^2)). 
Instead, observe that at any index i, the water height is bounded by min(left_max, right_max). Precomputing these in a single pass or maintaining two pointers starting from both boundaries lets you solve it in linear O(N) time and O(1) space! Let me know if you would like a code walkthrough.`
      });
    }, 1200);
  };

  const handleReset = () => {
    setSubmitted(false);
    setTaReply(null);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#151a24] border border-[#2b3547] rounded-xl shadow-2xl overflow-hidden text-gray-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#10141c] border-b border-[#222a38]">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-100">Raise TA Doubt</h3>
              <p className="text-[11px] text-gray-400">
                Problem #{problemId}: {problemTitle}
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-gray-200 p-1 rounded-lg hover:bg-[#1f2634] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 text-xs space-y-4">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  What kind of help do you need?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDoubtType('logic')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      doubtType === 'logic'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                        : 'bg-[#1a202c] border-[#293345] text-gray-400 hover:bg-[#1f2736]'
                    }`}
                  >
                    <div className="font-medium text-xs">Concept / Logic</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Stuck on algorithm approach</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDoubtType('tle')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      doubtType === 'tle'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                        : 'bg-[#1a202c] border-[#293345] text-gray-400 hover:bg-[#1f2736]'
                    }`}
                  >
                    <div className="font-medium text-xs">Time Limit (TLE)</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Need complexity optimization</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDoubtType('testcase')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      doubtType === 'testcase'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                        : 'bg-[#1a202c] border-[#293345] text-gray-400 hover:bg-[#1f2736]'
                    }`}
                  >
                    <div className="font-medium text-xs">Failed Test Case</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Edge case debugging</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Describe where you are stuck:
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. I am getting Time Limit Exceeded when computing max bar for each index..."
                  className="w-full bg-[#10141c] border border-[#2b3547] rounded-lg p-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500 placeholder-gray-600"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-[#1a202c] hover:bg-[#222a3a] text-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-900/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Doubt Request</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 py-2">
              <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-lg">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold text-xs">Doubt Ticket Raised Successfully!</div>
                  <div className="text-[11px] text-emerald-300/80">A dedicated AlgoForge Mentor has responded below:</div>
                </div>
              </div>

              {taReply ? (
                <div className="p-4 rounded-lg bg-[#10141c] border border-[#263145] space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-[10px]">
                        TA
                      </div>
                      <span className="font-semibold text-blue-400">{taReply.author}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{taReply.time}</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed font-sans text-xs pt-1">
                    {taReply.message}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 py-6 text-gray-400 text-xs">
                  <Bot className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Routing to available AlgoForge Mentor...</span>
                </div>
              )}

              <div className="text-right pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Close & Continue Coding
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

