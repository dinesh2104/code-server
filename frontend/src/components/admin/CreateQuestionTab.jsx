import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Code2, 
  Layers, 
  Sparkles,
  HelpCircle,
  FileText,
  ListPlus
} from 'lucide-react';

export default function CreateQuestionTab({ modules = [], onQuestionCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    id: '',
    moduleId: modules[0]?.id || 'arrays',
    difficulty: 'Medium',
    score: 100,
    timeLimitMs: 2000,
    tags: '',
    description: '',
    constraints: '* 1 <= N <= 10^5\n* 1 <= A[i] <= 10^9',
    inputFormat: 'The first argument is an integer array A.',
    outputFormat: 'Return an integer representing the answer.',
    examples: [
      {
        input: 'A = [1, 2, 3]',
        output: '6',
        explanation: 'Sum of all elements is 1 + 2 + 3 = 6.'
      }
    ],
    sampleTestCases: [
      { id: 1, input: '[1, 2, 3]', expectedOutput: '6' }
    ],
    hiddenTestCases: [
      { id: 2, input: '[10, 20]', expectedOutput: '30' },
      { id: 3, input: '[0]', expectedOutput: '0' }
    ],
    starterPython: `class Solution:\n    # @param A : list of integers\n    # @return an integer\n    def solve(self, A):\n        # Write your code here\n        pass\n`,
    starterJS: `module.exports = {\n    //param A : array of integers\n    //return an integer\n    solve: function(A) {\n        // Write your code here\n        return 0;\n    }\n};`,
    hints: ['Hint 1: Consider the brute force vs optimal single-pass approach.'],
    editorial: '### Optimal Approach\nWe can solve this problem in O(N) time and O(1) space.'
  });

  const [activeStep, setActiveStep] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Input Changes
  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  // Test cases helpers
  const handleAddSampleCase = () => {
    setFormData(prev => ({
      ...prev,
      sampleTestCases: [
        ...prev.sampleTestCases,
        { id: prev.sampleTestCases.length + 1, input: '', expectedOutput: '' }
      ]
    }));
  };

  const handleRemoveSampleCase = (idx) => {
    setFormData(prev => ({
      ...prev,
      sampleTestCases: prev.sampleTestCases.filter((_, i) => i !== idx)
    }));
  };

  const handleUpdateSampleCase = (idx, key, val) => {
    const updated = [...formData.sampleTestCases];
    updated[idx][key] = val;
    setFormData(prev => ({ ...prev, sampleTestCases: updated }));
  };

  const handleAddHiddenCase = () => {
    setFormData(prev => ({
      ...prev,
      hiddenTestCases: [
        ...prev.hiddenTestCases,
        { id: prev.hiddenTestCases.length + 10, input: '', expectedOutput: '' }
      ]
    }));
  };

  const handleRemoveHiddenCase = (idx) => {
    setFormData(prev => ({
      ...prev,
      hiddenTestCases: prev.hiddenTestCases.filter((_, i) => i !== idx)
    }));
  };

  const handleUpdateHiddenCase = (idx, key, val) => {
    const updated = [...formData.hiddenTestCases];
    updated[idx][key] = val;
    setFormData(prev => ({ ...prev, hiddenTestCases: updated }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Please enter a problem title.');
      return;
    }
    if (formData.sampleTestCases.length === 0) {
      setErrorMsg('Please provide at least one sample test case.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        title: formData.title,
        id: formData.id || `${Date.now() % 10000}`,
        moduleId: formData.moduleId,
        difficulty: formData.difficulty,
        score: Number(formData.score),
        timeLimitMs: Number(formData.timeLimitMs),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        description: formData.description,
        constraints: formData.constraints,
        inputFormat: formData.inputFormat,
        outputFormat: formData.outputFormat,
        examples: formData.examples,
        sampleTestCases: formData.sampleTestCases,
        hiddenTestCases: formData.hiddenTestCases,
        starterCodes: {
          python: formData.starterPython,
          javascript: formData.starterJS
        },
        hints: formData.hints,
        editorial: formData.editorial
      };

      const res = await fetch('/api/admin/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Question "#${data.problem.id} - ${data.problem.title}" created successfully!`);
        if (onQuestionCreated) onQuestionCreated(data.problem);
      } else {
        setErrorMsg(data.message || 'Failed to create question.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error while creating question.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#212938] pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Create Coding Challenge (GFG Style)
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Define algorithmic problem statements, constraints, and validation test suites
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Tabs */}
      <div className="flex border-b border-[#212938] text-xs">
        <button
          type="button"
          onClick={() => setActiveStep('basic')}
          className={`px-4 py-2.5 font-semibold border-b-2 transition-colors ${
            activeStep === 'basic'
              ? 'border-blue-500 text-blue-400 bg-[#161c26]'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          1. Basic Meta & Module
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('statement')}
          className={`px-4 py-2.5 font-semibold border-b-2 transition-colors ${
            activeStep === 'statement'
              ? 'border-blue-500 text-blue-400 bg-[#161c26]'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          2. Description & Constraints
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('testcases')}
          className={`px-4 py-2.5 font-semibold border-b-2 transition-colors ${
            activeStep === 'testcases'
              ? 'border-blue-500 text-blue-400 bg-[#161c26]'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          3. Test Cases Suite ({formData.sampleTestCases.length + formData.hiddenTestCases.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('code')}
          className={`px-4 py-2.5 font-semibold border-b-2 transition-colors ${
            activeStep === 'code'
              ? 'border-blue-500 text-blue-400 bg-[#161c26]'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          4. Starter Code & Editorial
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= STEP 1: BASIC META ================= */}
        {activeStep === 'basic' && (
          <div className="space-y-4 p-5 rounded-xl bg-[#161c26] border border-[#232c3d]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Problem Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Subarray with Given Sum"
                  className="w-full px-3 py-2 rounded-lg bg-[#11151e] border border-[#242e40] text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Assign Module / Category *
                </label>
                <select
                  value={formData.moduleId}
                  onChange={(e) => handleChange('moduleId', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#11151e] border border-[#242e40] text-xs text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#11151e] border border-[#242e40] text-xs text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Score / Points
                </label>
                <input
                  type="number"
                  value={formData.score}
                  onChange={(e) => handleChange('score', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#11151e] border border-[#242e40] text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Time Limit (ms)
                </label>
                <input
                  type="number"
                  value={formData.timeLimitMs}
                  onChange={(e) => handleChange('timeLimitMs', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#11151e] border border-[#242e40] text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="Arrays, Two Pointers, Prefix Sum"
                  className="w-full px-3 py-2 rounded-lg bg-[#11151e] border border-[#242e40] text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 text-right">
              <button
                type="button"
                onClick={() => setActiveStep('statement')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
              >
                Next: Description & Constraints →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: STATEMENT & CONSTRAINTS ================= */}
        {activeStep === 'statement' && (
          <div className="space-y-4 p-5 rounded-xl bg-[#161c26] border border-[#232c3d]">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Problem Description (Markdown) *
              </label>
              <textarea
                rows={5}
                required
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Given an array of integers A, find..."
                className="w-full p-3 rounded-lg bg-[#11151e] border border-[#242e40] text-xs text-gray-200 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Constraints
              </label>
              <textarea
                rows={3}
                value={formData.constraints}
                onChange={(e) => handleChange('constraints', e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#11151e] border border-[#242e40] text-xs text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Input Format
                </label>
                <textarea
                  rows={2}
                  value={formData.inputFormat}
                  onChange={(e) => handleChange('inputFormat', e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#11151e] border border-[#242e40] text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Output Format
                </label>
                <textarea
                  rows={2}
                  value={formData.outputFormat}
                  onChange={(e) => handleChange('outputFormat', e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#11151e] border border-[#242e40] text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setActiveStep('basic')}
                className="px-4 py-2 rounded-lg bg-[#1f2636] text-gray-300 text-xs font-semibold"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep('testcases')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
              >
                Next: Test Cases →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: TEST CASES SUITE ================= */}
        {activeStep === 'testcases' && (
          <div className="space-y-5 p-5 rounded-xl bg-[#161c26] border border-[#232c3d]">
            {/* Sample Testcases */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                  Sample Test Cases (Publicly Visible)
                </h3>
                <button
                  type="button"
                  onClick={handleAddSampleCase}
                  className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Sample Case</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.sampleTestCases.map((tc, idx) => (
                  <div key={idx} className="p-3 bg-[#11151e] border border-[#202737] rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3 relative">
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">Input Argument(s):</span>
                      <input
                        type="text"
                        value={tc.input}
                        onChange={(e) => handleUpdateSampleCase(idx, 'input', e.target.value)}
                        placeholder="e.g. [1, 2, 3]"
                        className="w-full px-2.5 py-1.5 rounded bg-[#161c26] border border-[#263145] font-mono text-xs text-emerald-400"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">Expected Output:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tc.expectedOutput}
                          onChange={(e) => handleUpdateSampleCase(idx, 'expectedOutput', e.target.value)}
                          placeholder="e.g. 6"
                          className="w-full px-2.5 py-1.5 rounded bg-[#161c26] border border-[#263145] font-mono text-xs text-amber-300"
                        />
                        {formData.sampleTestCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSampleCase(idx)}
                            className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Testcases */}
            <div className="pt-3 border-t border-[#202737]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                  Secret Hidden Test Cases (Used for Final Grading)
                </h3>
                <button
                  type="button"
                  onClick={handleAddHiddenCase}
                  className="px-2.5 py-1 rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Hidden Case</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.hiddenTestCases.map((tc, idx) => (
                  <div key={idx} className="p-3 bg-[#11151e] border border-[#202737] rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3 relative">
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">Hidden Input:</span>
                      <input
                        type="text"
                        value={tc.input}
                        onChange={(e) => handleUpdateHiddenCase(idx, 'input', e.target.value)}
                        placeholder="e.g. [10, 20, 30]"
                        className="w-full px-2.5 py-1.5 rounded bg-[#161c26] border border-[#263145] font-mono text-xs text-emerald-400"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">Expected Output:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tc.expectedOutput}
                          onChange={(e) => handleUpdateHiddenCase(idx, 'expectedOutput', e.target.value)}
                          placeholder="e.g. 60"
                          className="w-full px-2.5 py-1.5 rounded bg-[#161c26] border border-[#263145] font-mono text-xs text-amber-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveHiddenCase(idx)}
                          className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setActiveStep('statement')}
                className="px-4 py-2 rounded-lg bg-[#1f2636] text-gray-300 text-xs font-semibold"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep('code')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
              >
                Next: Starter Code & Editorial →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: STARTER CODE & EDITORIAL ================= */}
        {activeStep === 'code' && (
          <div className="space-y-4 p-5 rounded-xl bg-[#161c26] border border-[#232c3d]">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Python 3 Starter Template
              </label>
              <textarea
                rows={5}
                value={formData.starterPython}
                onChange={(e) => handleChange('starterPython', e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#11151e] border border-[#242e40] font-mono text-xs text-gray-200 focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                JavaScript Starter Template
              </label>
              <textarea
                rows={5}
                value={formData.starterJS}
                onChange={(e) => handleChange('starterJS', e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#11151e] border border-[#242e40] font-mono text-xs text-gray-200 focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Editorial Approach & Complexity
              </label>
              <textarea
                rows={4}
                value={formData.editorial}
                onChange={(e) => handleChange('editorial', e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#11151e] border border-[#242e40] text-xs text-gray-200 focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#212938]">
              <button
                type="button"
                onClick={() => setActiveStep('testcases')}
                className="px-4 py-2 rounded-lg bg-[#1f2636] text-gray-300 text-xs font-semibold"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Publishing Challenge...' : 'Publish Challenge to Platform'}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

