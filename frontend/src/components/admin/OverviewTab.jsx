import React from 'react';
import { 
  Users, 
  HelpCircle, 
  FolderKanban, 
  Send, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  Award,
  Layers,
  Clock,
  Code2
} from 'lucide-react';

export default function OverviewTab({ stats, onNavigateTab }) {
  if (!stats) {
    return (
      <div className="p-8 text-center text-gray-500 text-xs">
        Loading platform analytics...
      </div>
    );
  }

  const {
    totalUsers,
    activeUsers,
    totalProblems,
    totalModules,
    totalSubmissions,
    acceptedCount,
    globalAcceptanceRate,
    difficultyBreakdown = {},
    moduleUtilization = [],
    recentActivity = []
  } = stats;

  return (
    <div className="space-y-6">
      {/* 1. KPI Highlight Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-4 rounded-xl bg-[#161c26] border border-[#232c3d] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-100">{totalUsers}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {activeUsers} Active Mentees
          </div>
        </div>

        {/* Total Questions */}
        <div className="p-4 rounded-xl bg-[#161c26] border border-[#232c3d] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Questions</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-100">{totalProblems}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            Across {totalModules} Modules
          </div>
        </div>

        {/* Total Submissions */}
        <div className="p-4 rounded-xl bg-[#161c26] border border-[#232c3d] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Code Submissions</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-100">{totalSubmissions}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            {acceptedCount} Accepted runs
          </div>
        </div>

        {/* Global Acceptance Rate */}
        <div className="p-4 rounded-xl bg-[#161c26] border border-[#232c3d] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Acceptance Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">{globalAcceptanceRate}%</div>
          <div className="text-[11px] text-gray-400 mt-1">
            Platform pass average
          </div>
        </div>
      </div>

      {/* 2. Middle Grid: Module Utilization & Difficulty Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Utilization & Engagement (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#161c26] border border-[#232c3d] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#212938] pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-blue-400" />
                Module Utilization & Reach
              </h3>
              <p className="text-[11px] text-gray-400">
                Tracking user submissions, problem completion, and access across modules
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('modules')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Manage Modules →
            </button>
          </div>

          <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
            {moduleUtilization.map((mod) => (
              <div key={mod.moduleId} className="p-3 bg-[#11151e] rounded-lg border border-[#1f2737] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-200">{mod.moduleName}</span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      ({mod.totalProblems} Questions)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="text-gray-400">
                      Access: <strong className="text-gray-200">{mod.usersWithAccess} users</strong>
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      {mod.totalAttempts} attempts ({mod.acceptedAttempts} passed)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#1c2433] h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, Math.max(10, (mod.totalAttempts / Math.max(1, totalSubmissions)) * 100))}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Breakdown & Quick Actions (1 Col) */}
        <div className="space-y-6">
          {/* Difficulty Card */}
          <div className="p-5 rounded-xl bg-[#161c26] border border-[#232c3d] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Difficulty Distribution
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2 rounded bg-[#11151e] border border-[#1f2737]">
                <span className="font-semibold text-emerald-400">Easy</span>
                <span className="font-bold text-gray-200">{difficultyBreakdown.Easy || 0} Problems</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-[#11151e] border border-[#1f2737]">
                <span className="font-semibold text-amber-400">Medium</span>
                <span className="font-bold text-gray-200">{difficultyBreakdown.Medium || 0} Problems</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-[#11151e] border border-[#1f2737]">
                <span className="font-semibold text-rose-400">Hard</span>
                <span className="font-bold text-gray-200">{difficultyBreakdown.Hard || 0} Problems</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#202737]">
              <button
                onClick={() => onNavigateTab('create_question')}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-900/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>+ Create New Question</span>
              </button>
            </div>
          </div>

          {/* User Access Summary Card */}
          <div className="p-5 rounded-xl bg-[#161c26] border border-[#232c3d] shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              User Access Control
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Allocate customized module access to specific cohorts or individual students.
            </p>
            <button
              onClick={() => onNavigateTab('users')}
              className="w-full py-2 px-3 rounded-lg bg-[#1e2535] hover:bg-[#283246] border border-[#2e3a50] text-gray-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Manage User Permissions →</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Recent Live Submissions Feed */}
      <div className="p-5 rounded-xl bg-[#161c26] border border-[#232c3d] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#212938] pb-3">
          <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Recent Platform Activity
          </h3>
          <span className="text-xs text-gray-500">Live submissions across all users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-[#222a38]">
                <th className="pb-2.5 font-semibold">User</th>
                <th className="pb-2.5 font-semibold">Problem</th>
                <th className="pb-2.5 font-semibold">Module</th>
                <th className="pb-2.5 font-semibold">Verdict</th>
                <th className="pb-2.5 font-semibold">Runtime</th>
                <th className="pb-2.5 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2636]">
              {recentActivity.map((act) => (
                <tr key={act.id} className="hover:bg-[#1a2130] transition-colors">
                  <td className="py-2.5 font-medium text-gray-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                      {act.userName?.[0] || 'U'}
                    </div>
                    <span>{act.userName}</span>
                  </td>
                  <td className="py-2.5 text-gray-300 font-medium">
                    #{act.problemId} - {act.problemTitle}
                  </td>
                  <td className="py-2.5 text-gray-400 uppercase font-mono text-[10px]">
                    {act.moduleId}
                  </td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      act.verdict === 'Accepted'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {act.verdict}
                    </span>
                  </td>
                  <td className="py-2.5 text-gray-400 font-mono">
                    {act.runtimeMs} ms
                  </td>
                  <td className="py-2.5 text-gray-500 text-[11px]">
                    {new Date(act.timeAgo).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

