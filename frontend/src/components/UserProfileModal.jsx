import React, { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Activity,
  ShoppingBag,
  Coins,
  AlertCircle,
  Edit3,
  Save,
  User,
  Mail,
  BookOpen,
  Briefcase,
  Code2,
  Calendar,
  GraduationCap,
  Crown,
  KeyRound,
  ChevronRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function UserProfileModal({ 
  isOpen, 
  onClose, 
  user, 
  onBuyFreeze, 
  onUpdateProfile 
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit'
  const [isBuying, setIsBuying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Editable Form State
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    college: '',
    targetRole: '',
    preferredLanguage: 'python',
    github: '',
    linkedin: '',
    notes: ''
  });

  // Populate form data whenever user changes or modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || (user.role === 'admin' 
          ? 'Lead Systems Architect & Competitive Programming Mentor at AlgoForge. Managing core curriculum and online judge infrastructure.' 
          : 'Passionate student mentee solving algorithms and data structures.'),
        college: user.college || (user.role === 'admin' ? 'AlgoForge Core Engineering' : 'Technical University'),
        targetRole: user.targetRole || (user.role === 'admin' ? 'System Superadministrator' : 'Software Engineer (SDE-1)'),
        preferredLanguage: user.preferredLanguage || 'python',
        github: user.github || (user.role === 'admin' ? 'dineshadm' : `${user.id}_dev`),
        linkedin: user.linkedin || (user.role === 'admin' ? 'in/dineshadm' : `in/${user.id}`),
        notes: user.notes || ''
      });
      setError('');
      setMsg('');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const isAdmin = user.role === 'admin';

  // Handle Streak Freeze Purchase
  const handlePurchaseFreeze = async () => {
    if ((user.points || 0) < 100) {
      setError('You need at least 100 points to purchase a Streak Freeze. Solve more challenges to earn points!');
      return;
    }

    setIsBuying(true);
    setError('');
    setMsg('');

    try {
      const res = await fetch('/api/user/buy-freeze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, cost: 100 })
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setMsg('🧊 Streak Freeze purchased! Your streak is protected from inactivity.');
        if (onBuyFreeze) onBuyFreeze(data);
      } else {
        setError(data.message || 'Failed to purchase streak freeze.');
      }
    } catch (e) {
      setError('Error connecting to server.');
    } finally {
      setIsBuying(false);
    }
  };

  // Handle Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Full name cannot be empty.');
      return;
    }

    setIsSaving(true);
    setError('');
    setMsg('');

    try {
      if (onUpdateProfile) {
        await onUpdateProfile(formData);
        setMsg('Profile details successfully updated!');
        setActiveTab('overview');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#131722] border border-[#263145] rounded-2xl shadow-2xl overflow-hidden text-gray-200 max-h-[92vh] flex flex-col">
        {/* Modal Top Header with Role Distinction */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          isAdmin 
            ? 'bg-gradient-to-r from-purple-950/60 via-[#161c2c] to-[#121622] border-purple-900/40' 
            : 'bg-[#10141e] border-[#222b3d]'
        }`}>
          <div className="flex items-center space-x-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-white text-base shadow-lg ${
              isAdmin 
                ? 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 shadow-purple-900/40 ring-2 ring-purple-400/30' 
                : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-blue-900/40 ring-2 ring-blue-400/20'
            }`}>
              {isAdmin ? <Crown className="w-6 h-6 text-yellow-300" /> : (user.name?.[0] || 'U')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-gray-100">{user.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                  isAdmin 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-950' 
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}>
                  {isAdmin && <Crown className="w-3 h-3 text-yellow-400" />}
                  {user.role}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                <Mail className="w-3 h-3 text-gray-500" />
                <span>{user.email}</span>
                <span className="text-gray-600">•</span>
                <span className="text-[11px] text-gray-500 font-mono">ID: {user.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'overview' ? (
              <button
                onClick={() => {
                  setActiveTab('edit');
                  setError('');
                  setMsg('');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#1f2738] hover:bg-[#2b354c] border border-[#2d3a52] text-xs font-semibold text-blue-400 hover:text-blue-300 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setError('');
                  setMsg('');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#1f2738] hover:bg-[#2b354c] border border-[#2d3a52] text-xs font-semibold text-gray-300 transition-all"
              >
                View Profile
              </button>
            )}

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 p-1.5 rounded-lg hover:bg-[#21293a] transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Feedback Notifications */}
        {msg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {activeTab === 'overview' ? (
            /* ================= VIEW MODE: USER DETAILS & GAMIFICATION ================= */
            <div className="space-y-5">
              {/* 1. Quick Stats HUD */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#10141e] border border-[#1f2739] text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
                    <Coins className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Points</span>
                  </div>
                  <div className="text-lg font-black text-amber-300">{user.points || 0}</div>
                  <span className="text-[10px] text-gray-500">Reward balance</span>
                </div>

                <div className="p-3 rounded-xl bg-[#10141e] border border-[#1f2739] text-center">
                  <div className="flex items-center justify-center gap-1 text-orange-400 mb-0.5">
                    <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Streak</span>
                  </div>
                  <div className="text-lg font-black text-orange-400">{user.streak || 0}d</div>
                  <span className="text-[10px] text-gray-500">Practice streak</span>
                </div>

                <div className="p-3 rounded-xl bg-[#10141e] border border-[#1f2739] text-center">
                  <div className="flex items-center justify-center gap-1 text-cyan-400 mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Freezes</span>
                  </div>
                  <div className="text-lg font-black text-cyan-400">{user.streakFreezes || 0}</div>
                  <span className="text-[10px] text-gray-500">Streak shields</span>
                </div>

                <div className="p-3 rounded-xl bg-[#10141e] border border-[#1f2739] text-center">
                  <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Solved</span>
                  </div>
                  <div className="text-lg font-black text-emerald-400">
                    {user.solvedCount || user.solvedProblemIds?.length || 0}
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {user.totalSubmissions ? `${user.totalSubmissions} submissions` : '0 submissions'}
                  </span>
                </div>
              </div>

              {/* 2. User Bio & Professional Background Card */}
              <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2738] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1b2230] pb-2">
                  <h4 className="font-bold text-xs text-gray-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Personal & Professional Info</span>
                  </h4>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Member since {new Date(user.createdAt || '2026-10-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed italic bg-[#151a26] p-3 rounded-lg border border-[#21293a]">
                  "{user.bio || 'No bio specified yet. Click Edit Profile to add your background and goals!'}"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-semibold">College / Organization</span>
                      <span className="text-gray-200 font-medium">{user.college || 'Not specified'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-semibold">Target Engineering Role</span>
                      <span className="text-gray-200 font-medium">{user.targetRole || 'Software Engineer (SDE-1)'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-semibold">Preferred Language</span>
                      <span className="text-gray-200 font-medium uppercase font-mono">{user.preferredLanguage || 'Python'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-semibold">Module Access Level</span>
                      <span className="text-gray-200 font-medium">
                        {user.accessibleModules?.includes('all') ? 'Full Curriculum (All 13 Modules)' : `${user.accessibleModules?.length || 0} Modules Assigned`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Profiles */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#1b2230]">
                  {user.github && (
                    <a
                      href={`https://github.com/${user.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161c28] hover:bg-[#202838] border border-[#273245] text-gray-300 hover:text-white transition-colors text-xs font-mono"
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-gray-400" />
                      <span>github.com/{user.github}</span>
                      <ExternalLink className="w-3 h-3 text-gray-500 ml-0.5" />
                    </a>
                  )}

                  {user.linkedin && (
                    <a
                      href={`https://linkedin.com/${user.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161c28] hover:bg-[#202838] border border-[#273245] text-gray-300 hover:text-white transition-colors text-xs font-mono"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>linkedin.com/{user.linkedin}</span>
                      <ExternalLink className="w-3 h-3 text-gray-500 ml-0.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* 3. Role Privileges & Info Card */}
              {isAdmin ? (
                /* ADMIN HAS ALL PRIVILEGES AND INFO */
                <div className="p-4 rounded-xl bg-gradient-to-tr from-purple-950/40 via-[#181a28] to-[#121622] border border-purple-800/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-900/30 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                        <KeyRound className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-extrabold text-xs text-purple-200">
                        Administrator Privileges & Master Info
                      </h4>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-500/30">
                      Superadmin Level
                    </span>
                  </div>

                  <p className="text-[11px] text-purple-200/80 leading-relaxed">
                    This account possesses unrestricted administrative privileges across the entire AlgoForge Arena platform.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-800/30 text-gray-300 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-purple-200 font-semibold block">Full Admin Console Access:</strong>
                        <span>Open & operate Question Authoring, Curriculum provisioning, and Mentee Telemetry.</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-800/30 text-gray-300 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-purple-200 font-semibold block">Problem Management:</strong>
                        <span>Create, modify starter codes, adjust hidden test cases, and delete DSA challenges.</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-800/30 text-gray-300 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-purple-200 font-semibold block">User Governance:</strong>
                        <span>Provision users, grant module permissions, switch roles, and update learner statuses.</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-800/30 text-gray-300 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-purple-200 font-semibold block">System Telemetry & Logs:</strong>
                        <span>Real-time access to user submission traces, memory metrics, and runtime charts.</span>
                      </div>
                    </div>
                  </div>

                  {user.notes && (
                    <div className="pt-1 text-[11px] text-gray-400">
                      <span className="font-semibold text-purple-300">Admin System Notes:</span> {user.notes}
                    </div>
                  )}
                </div>
              ) : (
                /* STUDENT ROLE INFO */
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2738] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#1b2230] pb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <h4 className="font-bold text-xs text-gray-200">Student Mentee Account</h4>
                    </div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded">
                      Standard Learner
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Student accounts have full access to solve problems, unlock hints using points, earn streaks, and execute code in sandboxed runners. Administrator Console is restricted to staff & instructor accounts.
                  </p>
                </div>
              )}

              {/* 4. Streak Freeze Store Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-indigo-950/40 border border-cyan-800/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-cyan-200">Streak Freeze Protection Store</h4>
                      <p className="text-[11px] text-gray-400">Protects your daily streak if you miss practicing for a day.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-amber-300">100 pts each</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-gray-400">
                    You currently have <strong className="text-cyan-300 font-bold">{user.streakFreezes || 0}</strong> streak freezes
                  </span>
                  <button
                    onClick={handlePurchaseFreeze}
                    disabled={isBuying || (user.points || 0) < 100}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-950/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isBuying ? 'Purchasing...' : 'Buy Freeze (100 pts)'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ================= EDIT MODE: NORMAL PROFILE EDITING ================= */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[11px] text-blue-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Update your personal details, career goals, and social handles. Changes are saved immediately.</span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-[#161c28] border border-[#273245] rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Bio / Headline
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell others about your technical interests, coding journey, or target company..."
                  className="w-full bg-[#161c28] border border-[#273245] rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                />
              </div>

              {/* College & Target Role Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    College / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={e => setFormData({ ...formData, college: e.target.value })}
                    placeholder="e.g. Stanford University or Google"
                    className="w-full bg-[#161c28] border border-[#273245] rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Target Engineering Role
                  </label>
                  <select
                    value={formData.targetRole}
                    onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full bg-[#161c28] border border-[#273245] rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Software Engineer (SDE-1)">Software Engineer (SDE-1)</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Backend Specialist">Backend Specialist</option>
                    <option value="Competitive Programmer">Competitive Programmer</option>
                    <option value="System Architect">System Architect</option>
                    <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  </select>
                </div>
              </div>

              {/* Preferred Language & Role Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Preferred Language
                  </label>
                  <select
                    value={formData.preferredLanguage}
                    onChange={e => setFormData({ ...formData, preferredLanguage: e.target.value })}
                    className="w-full bg-[#161c28] border border-[#273245] rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="python">Python 3 (CPython 3.10+)</option>
                    <option value="javascript">JavaScript (Node.js 18+)</option>
                    <option value="cpp">C++ (GCC C++17)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Account Role
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${user.role.toUpperCase()} (Assigned by Platform)`}
                    className="w-full bg-[#11151e] border border-[#222b3b] rounded-lg px-3 py-2 text-xs text-gray-400 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* Social Handles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    GitHub Username
                  </label>
                  <div className="flex items-center bg-[#161c28] border border-[#273245] rounded-lg overflow-hidden focus-within:border-blue-500">
                    <span className="px-2.5 text-gray-500 text-xs font-mono">github.com/</span>
                    <input
                      type="text"
                      value={formData.github}
                      onChange={e => setFormData({ ...formData, github: e.target.value })}
                      placeholder="username"
                      className="w-full bg-transparent px-2 py-2 text-xs text-gray-100 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    LinkedIn Handle
                  </label>
                  <div className="flex items-center bg-[#161c28] border border-[#273245] rounded-lg overflow-hidden focus-within:border-blue-500">
                    <span className="px-2.5 text-gray-500 text-xs font-mono">linkedin.com/</span>
                    <input
                      type="text"
                      value={formData.linkedin}
                      onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="in/username"
                      className="w-full bg-transparent px-2 py-2 text-xs text-gray-100 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Admin-only internal note editing */}
              {isAdmin && (
                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Administrative System Notes (Admin Only)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="System role notes, privileges, or maintenance tags..."
                    className="w-full bg-[#161c28] border border-purple-800/40 rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-[#202737]">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 rounded-lg bg-[#1a2130] hover:bg-[#252f44] text-gray-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-[#0f121a] border-t border-[#1e2636] flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <span>Logged in as: <strong className="text-gray-300">{user.name}</strong></span>
            <span className="text-gray-600">•</span>
            <span>Role: <strong className={isAdmin ? 'text-purple-400 uppercase font-bold' : 'text-blue-400 uppercase font-bold'}>{user.role}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#181f2c] hover:bg-[#232c3f] text-gray-300 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
