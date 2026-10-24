import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Code2,
  Tag,
  ExternalLink
} from 'lucide-react';

export default function ManageQuestionsTab({ 
  problems = [], 
  modules = [], 
  onRefresh, 
  onEditProblem 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('all');
  const [reassigningId, setReassigningId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Filtered problems
  const filteredProblems = problems.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesModule = selectedModuleFilter === 'all' || p.moduleId === selectedModuleFilter;
    const matchesDifficulty = selectedDifficultyFilter === 'all' || p.difficulty === selectedDifficultyFilter;

    return matchesSearch && matchesModule && matchesDifficulty;
  });

  // Re-assign module handler
  const handleQuickReassign = async (problemId, newModuleId) => {
    try {
      setReassigningId(problemId);
      const res = await fetch(`/api/admin/problems/${problemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId: newModuleId })
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(`Problem #${problemId} moved to '${data.problem.category}'`);
        setTimeout(() => setToastMsg(''), 3000);
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReassigningId(null);
    }
  };

  // Delete problem handler
  const handleDelete = async (problemId, problemTitle) => {
    if (!window.confirm(`Are you sure you want to permanently delete "#${problemId} - ${problemTitle}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/problems/${problemId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(`Problem #${problemId} deleted.`);
        setTimeout(() => setToastMsg(''), 3000);
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || 'Failed to delete problem');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-[#161c26] border border-[#232c3d] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search problems by title, ID or tag..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#11151e] border border-[#242e40] text-gray-200 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        {/* Filter by Module */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 font-medium">Module:</span>
          <select
            value={selectedModuleFilter}
            onChange={(e) => setSelectedModuleFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#11151e] border border-[#242e40] text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Modules ({problems.length})</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Difficulty */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 font-medium">Difficulty:</span>
          <select
            value={selectedDifficultyFilter}
            onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#11151e] border border-[#242e40] text-gray-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Problems Table */}
      <div className="p-4 rounded-xl bg-[#161c26] border border-[#232c3d] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#212938] pb-3 mb-3 text-xs">
          <span className="font-semibold text-gray-200">
            Total Matching: {filteredProblems.length} Questions
          </span>
          <span className="text-gray-500 text-[11px]">
            Tip: You can reassign a question's module directly using the Module dropdown selector.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-[#212938]">
                <th className="pb-2.5 font-semibold">ID</th>
                <th className="pb-2.5 font-semibold">Title</th>
                <th className="pb-2.5 font-semibold">Current Module</th>
                <th className="pb-2.5 font-semibold">Difficulty</th>
                <th className="pb-2.5 font-semibold">Score</th>
                <th className="pb-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2535]">
              {filteredProblems.map((p) => {
                const isReassigning = reassigningId === p.id;
                return (
                  <tr key={p.id} className="hover:bg-[#1a2130] transition-colors">
                    <td className="py-3 font-mono font-bold text-gray-400">
                      #{p.id}
                    </td>

                    <td className="py-3 font-medium text-gray-200">
                      <div>{p.title}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {p.tags?.slice(0, 3).map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] text-gray-500 bg-[#11151e] px-1.5 py-0.2 rounded border border-[#202737]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Quick Module Reassign Selector */}
                    <td className="py-3">
                      <select
                        disabled={isReassigning}
                        value={p.moduleId}
                        onChange={(e) => handleQuickReassign(p.id, e.target.value)}
                        className="px-2 py-1 rounded bg-[#11151e] border border-[#273245] text-xs font-medium text-blue-300 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
                        title="Reassign problem to a different module"
                      >
                        {modules.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        p.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        p.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {p.difficulty}
                      </span>
                    </td>

                    <td className="py-3 text-gray-300 font-mono">
                      {p.score} pts
                    </td>

                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {onEditProblem && (
                          <button
                            onClick={() => onEditProblem(p)}
                            className="p-1.5 rounded hover:bg-[#202838] text-gray-400 hover:text-blue-400 transition-colors"
                            title="Edit Problem"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 rounded hover:bg-[#202838] text-gray-400 hover:text-rose-400 transition-colors"
                          title="Delete Problem"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

