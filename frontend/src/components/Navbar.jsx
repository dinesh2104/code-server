import React, { useState } from 'react';
import { 
  ChevronRight, 
  Flame, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  Circle, 
  ChevronDown,
  Layers,
  Search,
  Type,
  Binary,
  Rows,
  Network,
  RotateCcw,
  ArrowUpDown,
  MoveHorizontal,
  Hash,
  Share2,
  Boxes,
  ShieldCheck,
  FolderKanban,
  User,
  Settings,
  Lock
} from 'lucide-react';

const CATEGORY_ICONS = {
  arrays: Layers,
  linked_lists: Network,
  binary_search: Search,
  strings: Type,
  bit_manipulation: Binary,
  stacks_and_queues: Rows,
  trees: Network,
  recursion: RotateCcw,
  sorting: ArrowUpDown,
  two_pointers: MoveHorizontal,
  hashing: Hash,
  graphs: Share2,
  dynamic_programming: Boxes
};

export default function Navbar({ 
  modules = [],
  allModules = [],
  problems = [], 
  currentProblem, 
  onSelectProblem, 
  onSelectModule,
  onOpenDoubtModal,
  onOpenAdmin,
  onOpenProfile,
  activeUser,
  allUsers = [],
  onSwitchUser,
  solvedProblemIds = []
}) {
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [isProblemDropdownOpen, setIsProblemDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const currentModuleId = currentProblem?.moduleId || 'arrays';
  const currentCategory = currentProblem?.category || 'Arrays';
  const isCurrentSolved = solvedProblemIds.includes(currentProblem?.id);

  // Filter problems for current module
  const currentModuleProblems = problems.filter(p => p.moduleId === currentModuleId);

  const CategoryIcon = CATEGORY_ICONS[currentModuleId] || Layers;

  // Determine user module restrictions
  const isAllAccess = activeUser?.role === 'admin' || activeUser?.accessibleModules?.includes('all');

  return (
    <header className="h-14 bg-[#11141b] border-b border-[#212631] px-4 flex items-center justify-between select-none z-20">
      {/* Left side: Logo & Breadcrumb Navigation */}
      <div className="flex items-center space-x-2.5 text-sm">
        {/* AlgoForge Brand Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-extrabold text-white shadow-md shadow-blue-500/25">
            <span className="text-sm tracking-tight font-mono">AF</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-gray-100 tracking-wider text-xs uppercase flex items-center gap-1.5">
              ALGOFORGE <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-1.5 py-0.2 rounded border border-blue-500/30">ARENA</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-tight">Code Judge & DSA Workspace</span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-gray-700/60 mx-1.5 hidden sm:block"></div>

        {/* ================= PATH: Module -> Category -> Question Number ================= */}
        <div className="flex items-center space-x-1.5 text-xs text-gray-400">
          {/* 1. Modules Root Indicator */}
          <span className="text-gray-400 font-medium hidden md:flex items-center gap-1">
            <FolderKanban className="w-3.5 h-3.5 text-gray-500" />
            <span>Modules</span>
          </span>

          <ChevronRight className="w-3.5 h-3.5 text-gray-600 hidden md:block" />

          {/* 2. Category / Module Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsModuleDropdownOpen(prev => !prev);
                setIsProblemDropdownOpen(false);
                setIsUserDropdownOpen(false);
              }}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-[#161c28] hover:bg-[#1f2738] border border-[#273245] text-xs font-semibold text-gray-200 transition-all cursor-pointer"
            >
              <CategoryIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentCategory}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isModuleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Modules Dropdown Menu */}
            {isModuleDropdownOpen && (
              <div 
                className="absolute left-0 top-full mt-1.5 w-72 bg-[#141923] border border-[#273246] rounded-xl shadow-2xl py-1.5 z-50 backdrop-blur-md animate-in fade-in"
                onMouseLeave={() => setIsModuleDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-[#202737] flex items-center justify-between">
                  <span>Available DSA Modules</span>
                  <span>{modules.length} Accessible</span>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {modules.map((m) => {
                    const Icon = CATEGORY_ICONS[m.id] || Layers;
                    const isSelected = m.id === currentModuleId;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          onSelectModule(m.id);
                          setIsModuleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors ${
                          isSelected
                            ? 'bg-blue-600/20 text-blue-400 font-semibold border-l-2 border-blue-500'
                            : 'text-gray-300 hover:bg-[#1b2230]'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                          <span className="truncate">{m.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {problems.filter(p => p.moduleId === m.id).length} Qs
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />

          {/* 3. Question Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProblemDropdownOpen(prev => !prev);
                setIsModuleDropdownOpen(false);
                setIsUserDropdownOpen(false);
              }}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-md bg-[#1a202c] hover:bg-[#222a3a] border border-[#2d3748] text-xs font-semibold text-gray-200 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-none">
                {isCurrentSolved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="truncate">#{currentProblem?.id} - {currentProblem?.title}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isProblemDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Question Dropdown Menu */}
            {isProblemDropdownOpen && (
              <div 
                className="absolute left-0 top-full mt-1.5 w-80 bg-[#141923] border border-[#273246] rounded-xl shadow-2xl py-1.5 z-50 backdrop-blur-md animate-in fade-in"
                onMouseLeave={() => setIsProblemDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-[#202737] flex items-center justify-between">
                  <span>{currentCategory} Problems</span>
                  <span>{currentModuleProblems.length} available</span>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {currentModuleProblems.map((p) => {
                    const isSolved = solvedProblemIds.includes(p.id);
                    const isSelected = p.id === currentProblem?.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectProblem(p.id);
                          setIsProblemDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors ${
                          isSelected 
                            ? 'bg-blue-600/15 text-blue-400 font-semibold border-l-2 border-blue-500' 
                            : 'text-gray-300 hover:bg-[#1b2230]'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {isSolved ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          )}
                          <span className="truncate">#{p.id} - {p.title}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ml-2 ${
                          p.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                          p.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {p.difficulty}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Admin Panel Button, Score, Help, User Avatar & Switcher */}
      <div className="flex items-center space-x-2.5 text-xs">
        {/* ================= ADMIN CONSOLE SWITCHER BUTTON (Admin Only) ================= */}
        {activeUser?.role === 'admin' && (
          <button
            onClick={onOpenAdmin}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-purple-900/30 transition-all cursor-pointer border border-purple-400/30 animate-in fade-in"
            title="Open Admin Management Console (Admin Privileges)"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Admin Panel</span>
          </button>
        )}

        {/* User Points Badge */}
        <button
          onClick={onOpenProfile}
          className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#192231] hover:bg-[#222e42] border border-[#273852] text-amber-300 font-semibold transition-all cursor-pointer shadow-sm group"
          title="Your Reward Points - Click to open Profile & Streak Store"
        >
          <Award className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>{activeUser?.points || 0} pts</span>
        </button>

        {/* Streak Counter & Freeze Indicator */}
        <button
          onClick={onOpenProfile}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#251b1f] hover:bg-[#34242a] border border-[#442831] text-orange-400 font-semibold transition-all cursor-pointer shadow-sm group"
          title="Daily Streak & Freezes - Click to manage"
        >
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 group-hover:scale-110 transition-transform" />
          <span>{activeUser?.streak || 0}d</span>
          {(activeUser?.streakFreezes || 0) > 0 && (
            <span className="text-cyan-300 font-mono text-[11px] bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/40 ml-0.5" title={`${activeUser.streakFreezes} Streak Freeze(s) available`}>
              🧊 {activeUser.streakFreezes}
            </span>
          )}
        </button>

        {/* Ask TA Doubt Button */}
        <button
          onClick={onOpenDoubtModal}
          className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 text-white font-medium shadow-sm transition-all shadow-rose-900/30 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Doubt</span>
        </button>

        {/* ================= USER PROFILE TRIGGER BUTTON ================= */}
        <button
          onClick={onOpenProfile}
          className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#181f2c] hover:bg-[#222b3d] border border-[#273245] transition-all cursor-pointer shadow-sm group"
          title="Click to view & edit your User Profile"
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shadow-sm ${
            activeUser?.role === 'admin' 
              ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 ring-1 ring-purple-400/40' 
              : 'bg-gradient-to-tr from-cyan-500 to-blue-600 ring-1 ring-blue-400/40'
          }`}>
            {activeUser?.name?.[0] || 'U'}
          </div>
          <div className="flex flex-col text-left hidden sm:flex">
            <span className="text-gray-200 font-semibold text-xs leading-none max-w-[100px] truncate group-hover:text-blue-300 transition-colors">
              {activeUser?.name?.split(' ')[0] || 'User'}
            </span>
            <span className={`text-[9px] uppercase font-bold leading-tight mt-0.5 ${
              activeUser?.role === 'admin' ? 'text-purple-400' : 'text-blue-400'
            }`}>
              {activeUser?.role || 'student'}
            </span>
          </div>
        </button>

        {/* ================= USER SWITCHER / SIMULATION DROPDOWN ================= */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserDropdownOpen(prev => !prev);
              setIsModuleDropdownOpen(false);
              setIsProblemDropdownOpen(false);
            }}
            className="p-1.5 rounded-lg bg-[#161c28] hover:bg-[#20293a] border border-[#273245] text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
            title="Switch User (Test Mentee / Admin Access)"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* User Switcher Dropdown */}
          {isUserDropdownOpen && (
            <div 
              className="absolute right-0 top-full mt-1.5 w-72 bg-[#141923] border border-[#273246] rounded-xl shadow-2xl py-2 z-50 backdrop-blur-md animate-in fade-in"
              onMouseLeave={() => setIsUserDropdownOpen(false)}
            >
              <div className="px-3 pb-2 border-b border-[#202737]">
                <div className="font-bold text-gray-100 text-xs">{activeUser?.name}</div>
                <div className="text-[11px] text-gray-400">{activeUser?.email}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    activeUser?.role === 'admin' 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {activeUser?.role?.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    {isAllAccess ? 'All Modules Unlocked' : `${activeUser?.accessibleModules?.length} Modules Accessible`}
                  </span>
                </div>
              </div>

              {/* View & Edit Profile Button */}
              <div className="p-2 border-b border-[#202737]">
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-cyan-600/20 hover:from-blue-600/40 hover:to-cyan-600/40 border border-blue-500/30 text-blue-300 font-semibold text-xs flex items-center justify-between transition-all shadow-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>View & Edit Profile</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.2 rounded border border-amber-500/30">
                    {activeUser?.points || 0} pts
                  </span>
                </button>
              </div>

              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Simulate / Test As User:
              </div>

              <div className="max-h-48 overflow-y-auto">
                {allUsers.map((u) => {
                  const isSelected = u.id === activeUser?.id;
                  const isUserAdmin = u.role === 'admin';
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u.id);
                        setIsUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors ${
                        isSelected 
                          ? 'bg-blue-600/20 text-blue-400 font-semibold border-l-2 border-blue-500' 
                          : 'text-gray-300 hover:bg-[#1a2130]'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-medium text-xs text-gray-200 flex items-center gap-1.5">
                          <span>{u.name}</span>
                          <span className={`text-[9px] px-1 rounded uppercase font-bold ${
                            isUserAdmin ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">{u.email}</div>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 shrink-0">
                        {u.accessibleModules?.includes('all') ? 'Full' : `${u.accessibleModules?.length} mod`}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 px-3 border-t border-[#202737] mt-1">
                {activeUser?.role === 'admin' ? (
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full py-1.5 rounded bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-semibold text-[11px] text-center block transition-colors shadow-sm"
                  >
                    ⚙️ Manage Users & Curriculum →
                  </button>
                ) : (
                  <div className="py-1 px-2 rounded bg-[#10141e] border border-[#1f2638] flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Student Mentee Access</span>
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-1.5 py-0.2 rounded">
                      Standard
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
