import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PlusCircle, 
  FileText, 
  FolderKanban, 
  Users, 
  ArrowLeft, 
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Edit3,
  X,
  Save,
  CheckCircle2
} from 'lucide-react';
import OverviewTab from './OverviewTab';
import CreateQuestionTab from './CreateQuestionTab';
import ManageQuestionsTab from './ManageQuestionsTab';
import ManageModulesTab from './ManageModulesTab';
import UserManagementTab from './UserManagementTab';

export default function AdminPortal({ 
  onBackToArena, 
  activeUserId,
  onSwitchActiveUser
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [modules, setModules] = useState([]);
  const [problems, setProblems] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProblem, setEditingProblem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Fetch all admin data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, modulesRes, problemsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/admin/modules').then(r => r.json()),
        fetch('/api/admin/problems').then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json())
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (modulesRes.success) setModules(modulesRes.modules);
      if (problemsRes.success) setProblems(problemsRes.problems);
      if (usersRes.success) setUsers(usersRes.users);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditProblemOpen = (prob) => {
    setEditingProblem(prob);
    setEditFormData({
      title: prob.title,
      moduleId: prob.moduleId,
      difficulty: prob.difficulty,
      score: prob.score,
      timeLimitMs: prob.timeLimitMs || 2000,
      description: prob.description || '',
      constraints: prob.constraints || ''
    });
  };

  const handleSaveProblemEdit = async (e) => {
    e.preventDefault();
    if (!editingProblem) return;

    try {
      const res = await fetch(`/api/admin/problems/${editingProblem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (data.success) {
        setEditingProblem(null);
        fetchData();
      } else {
        alert(data.message || 'Failed to update problem');
      }
    } catch (e) {
      alert('Error updating problem');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0e1117] text-gray-100 overflow-hidden font-sans">
      {/* Admin Top Bar */}
      <header className="h-14 bg-[#121620] border-b border-[#212938] px-4 flex items-center justify-between select-none z-20">
        <div className="flex items-center space-x-3">
          {/* Logo & Admin Badge */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center font-extrabold text-white shadow-md shadow-purple-500/20">
              <span className="text-sm tracking-tight font-mono">AF</span>
            </div>
            <div>
              <div className="font-extrabold text-gray-100 tracking-wider text-xs uppercase flex items-center gap-1.5">
                ALGOFORGE <span className="text-[10px] bg-purple-500/20 text-purple-400 font-bold px-1.5 py-0.2 rounded border border-purple-500/30">ADMIN CONSOLE</span>
              </div>
              <div className="text-[10px] text-gray-400 font-medium">Curriculum & User Access Engine</div>
            </div>
          </div>
        </div>

        {/* Center / Right: Return to Arena CTA */}
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            className="p-1.5 rounded-lg bg-[#1a2130] hover:bg-[#222c3f] border border-[#273245] text-gray-400 hover:text-gray-200 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <button
            onClick={onBackToArena}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-900/40 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch to Code Arena</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar Navigation */}
      <div className="flex-1 flex overflow-hidden">
        {/* Admin Left Sidebar */}
        <div className="w-60 bg-[#11141c] border-r border-[#1f2635] flex flex-col justify-between p-3 select-none">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Management Portal
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2.5 text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#181f2c]'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Overview & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('create_question')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2.5 text-xs font-semibold transition-all ${
                activeTab === 'create_question'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#181f2c]'
              }`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Add Question (GFG)</span>
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2.5 text-xs font-semibold transition-all ${
                activeTab === 'questions'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#181f2c]'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Manage Questions</span>
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30">
                {problems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('modules')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2.5 text-xs font-semibold transition-all ${
                activeTab === 'modules'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#181f2c]'
              }`}
            >
              <FolderKanban className="w-4 h-4 shrink-0" />
              <span>Manage Modules</span>
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30">
                {modules.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-2.5 text-xs font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#181f2c]'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>User & Module Access</span>
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30">
                {users.length}
              </span>
            </button>
          </div>

          {/* Bottom Card */}
          <div className="p-3 rounded-lg bg-[#161c28] border border-[#232c3d] text-[11px] text-gray-400">
            <span className="font-semibold text-gray-200 block mb-0.5">Role Permission Control</span>
            <span>Assign cohort-based module restrictions or grant complete platform access.</span>
          </div>
        </div>

        {/* Admin Content Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0e1117]">
          {activeTab === 'overview' && (
            <OverviewTab 
              stats={stats} 
              onNavigateTab={(tab) => setActiveTab(tab)} 
            />
          )}

          {activeTab === 'create_question' && (
            <CreateQuestionTab 
              modules={modules} 
              onQuestionCreated={() => {
                fetchData();
                setActiveTab('questions');
              }} 
            />
          )}

          {activeTab === 'questions' && (
            <ManageQuestionsTab 
              problems={problems} 
              modules={modules} 
              onRefresh={fetchData}
              onEditProblem={handleEditProblemOpen}
            />
          )}

          {activeTab === 'modules' && (
            <ManageModulesTab 
              modules={modules} 
              onRefresh={fetchData} 
            />
          )}

          {activeTab === 'users' && (
            <UserManagementTab 
              users={users} 
              modules={modules} 
              onRefresh={fetchData} 
              activeUserId={activeUserId}
              onSwitchActiveUser={onSwitchActiveUser}
            />
          )}
        </div>
      </div>

      {/* ================= MODAL: EDIT PROBLEM ================= */}
      {editingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-[#151a24] border border-[#2b3547] rounded-xl shadow-2xl overflow-hidden text-gray-200">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#10141c] border-b border-[#222a38]">
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-blue-400" />
                Edit Problem #{editingProblem.id}
              </h3>
              <button
                onClick={() => setEditingProblem(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProblemEdit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[#10141c] border border-[#263145] text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Module</label>
                  <select
                    value={editFormData.moduleId}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, moduleId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-[#10141c] border border-[#263145] text-gray-200 focus:outline-none focus:border-blue-500"
                  >
                    {modules.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Difficulty</label>
                  <select
                    value={editFormData.difficulty}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-[#10141c] border border-[#263145] text-gray-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Points / Score</label>
                  <input
                    type="number"
                    value={editFormData.score}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, score: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-[#10141c] border border-[#263145] text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Time Limit (ms)</label>
                  <input
                    type="number"
                    value={editFormData.timeLimitMs}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, timeLimitMs: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-[#10141c] border border-[#263145] text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Problem Description</label>
                <textarea
                  rows={4}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2.5 rounded-lg bg-[#10141c] border border-[#263145] text-gray-200 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#202737]">
                <button
                  type="button"
                  onClick={() => setEditingProblem(null)}
                  className="px-4 py-2 rounded-lg bg-[#1e2535] text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

