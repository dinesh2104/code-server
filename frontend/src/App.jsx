import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProblemPane from './components/ProblemPane';
import EditorPane from './components/EditorPane';
import ConsoleDrawer from './components/ConsoleDrawer';
import DoubtModal from './components/DoubtModal';
import SubmissionModal from './components/SubmissionModal';
import AdminPortal from './components/admin/AdminPortal';
import UserProfileModal from './components/UserProfileModal';
import confetti from 'canvas-confetti';

export default function App() {
  const [viewMode, setViewMode] = useState('arena'); // 'arena' | 'admin'
  const [activeUser, setActiveUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const [modules, setModules] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [problems, setProblems] = useState([]);
  const [currentProblemId, setCurrentProblemId] = useState('10');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [codeCache, setCodeCache] = useState({});

  // Console Drawer & Test Case Execution State
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(true);

  // Submissions History & Solved Tracking
  const [submissions, setSubmissions] = useState([]);
  const [solvedProblemIds, setSolvedProblemIds] = useState([]);

  // Modals
  const [isDoubtModalOpen, setIsDoubtModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [rewardToast, setRewardToast] = useState(null);
  const [viewingSubmission, setViewingSubmission] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Split Pane Width
  const [leftPaneWidth, setLeftPaneWidth] = useState(48);

  // 1. Fetch Active User and All Users on mount
  const fetchUsers = async () => {
    try {
      const [activeRes, usersRes] = await Promise.all([
        fetch('/api/users/active').then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json())
      ]);
      if (activeRes.success) setActiveUser(activeRes.user);
      if (usersRes.success) setAllUsers(usersRes.users);
    } catch (e) {
      console.error('Error fetching user info:', e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Fetch Problem & Modules List based on activeUser
  const fetchProblemsAndModules = () => {
    const url = activeUser ? `/api/problems?userId=${activeUser.id}` : '/api/problems';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.problems) {
            setProblems(data.problems);
            // If current problem is not in the accessible problems list, switch to first available
            if (data.problems.length > 0 && !data.problems.some(p => p.id === currentProblemId)) {
              setCurrentProblemId(data.problems[0].id);
            }
          }
          if (data.modules) setModules(data.modules);
          if (data.allModules) setAllModules(data.allModules);
        }
      })
      .catch(err => console.error('Error fetching problems list:', err));
  };

  useEffect(() => {
    fetchProblemsAndModules();
  }, [activeUser]);

  // Switch Active User (for testing role-based module access)
  const handleSwitchUser = async (newUserId) => {
    try {
      const res = await fetch('/api/users/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: newUserId })
      });
      const data = await res.json();
      if (data.success) {
        setActiveUser(data.user);
      }
    } catch (e) {
      console.error('Failed to switch active user:', e);
    }
  };

  // Handle module selection -> switches to the first problem in that module
  const handleSelectModule = (moduleId) => {
    const matching = problems.filter(p => p.moduleId === moduleId);
    if (matching.length > 0) {
      setCurrentProblemId(matching[0].id);
    }
  };

  // 3. Fetch Problem Details when currentProblemId changes
  useEffect(() => {
    if (!currentProblemId) return;

    fetch(`/api/problems/${currentProblemId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.problem) {
          const prob = data.problem;
          setCurrentProblem(prob);

          // Restore cached code or load starter code
          const cacheKey = `${prob.id}_${language}`;
          if (codeCache[cacheKey]) {
            setCode(codeCache[cacheKey]);
          } else {
            const starter = prob.starterCodes?.[language] || '';
            setCode(starter);
          }

          // Pre-populate custom input with first sample testcase
          if (prob.sampleTestCases && prob.sampleTestCases.length > 0) {
            setCustomInput(prob.sampleTestCases[0].input);
          }

          // Reset run & submit results for new problem
          setRunResult(null);
          setSubmissionResult(null);
        }
      })
      .catch(err => console.error('Error fetching problem details:', err));

    // Fetch past submissions
    fetch(`/api/submissions/${currentProblemId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.submissions) {
          setSubmissions(data.submissions);
          if (data.submissions.some(s => s.verdict === 'Accepted')) {
            setSolvedProblemIds(prev => Array.from(new Set([...prev, currentProblemId])));
          }
        }
      })
      .catch(err => console.error('Error fetching submissions:', err));
  }, [currentProblemId]);

  // Handle language switch
  const handleLanguageChange = (newLang) => {
    if (!currentProblem) return;
    const currentKey = `${currentProblem.id}_${language}`;
    setCodeCache(prev => ({ ...prev, [currentKey]: code }));

    setLanguage(newLang);
    const newKey = `${currentProblem.id}_${newLang}`;
    if (codeCache[newKey]) {
      setCode(codeCache[newKey]);
    } else {
      setCode(currentProblem.starterCodes?.[newLang] || '');
    }
  };

  // Reset to starter boilerplate
  const handleResetCode = () => {
    if (!currentProblem) return;
    if (window.confirm('Are you sure you want to reset your code to the starter template?')) {
      const starter = currentProblem.starterCodes?.[language] || '';
      setCode(starter);
      const cacheKey = `${currentProblem.id}_${language}`;
      setCodeCache(prev => ({ ...prev, [cacheKey]: starter }));
    }
  };

  // Handle Code changes
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (currentProblem) {
      const cacheKey = `${currentProblem.id}_${language}`;
      setCodeCache(prev => ({ ...prev, [cacheKey]: newCode }));
    }
  };

  // Handle Compile & Run
  const handleRun = async () => {
    if (!currentProblem || isRunning || isSubmitting) return;

    setIsRunning(true);
    setIsDrawerExpanded(true);

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: currentProblem.id,
          language,
          code,
          customInput: useCustomInput ? customInput : null
        })
      });

      const data = await res.json();
      if (data.success && data.result) {
        setRunResult(data.result);
      } else {
        alert(data.message || 'Run execution failed');
      }
    } catch (err) {
      console.error('Run failed:', err);
      alert('Network or server error during execution');
    } finally {
      setIsRunning(false);
    }
  };

  // Handle Unlocking Hint with User Points
  const handleUnlockHint = async (problemId, hintIndex, cost = 25) => {
    if (!activeUser) {
      throw new Error('Please select an active user first.');
    }
    const res = await fetch('/api/user/unlock-hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: activeUser.id,
        problemId,
        hintIndex,
        cost
      })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to unlock hint.');
    }
    // Update activeUser state with updated points and unlockedHints
    setActiveUser(prev => ({
      ...prev,
      points: data.points,
      unlockedHints: data.unlockedHints
    }));
    return data;
  };

  // Handle Streak Freeze Purchase
  const handleBuyFreeze = (data) => {
    setActiveUser(prev => ({
      ...prev,
      points: data.points,
      streakFreezes: data.streakFreezes
    }));
  };

  // Handle User Profile Updates (Normal Profile Editing)
  const handleUpdateProfile = async (formData) => {
    if (!activeUser) return;
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: activeUser.id,
        ...formData
      })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update profile details.');
    }
    setActiveUser(data.user);
    setAllUsers(prev => prev.map(u => u.id === data.user.id ? { ...u, ...data.user } : u));
    return data.user;
  };

  // Guard Admin Portal Access: Only Admins permitted
  const handleOpenAdmin = () => {
    if (activeUser?.role !== 'admin') {
      alert('Access Denied: Student accounts do not have permission to access the Administrator Panel.');
      return;
    }
    setViewMode('admin');
  };

  useEffect(() => {
    if (viewMode === 'admin' && activeUser && activeUser.role !== 'admin') {
      setViewMode('arena');
    }
  }, [activeUser, viewMode]);

  // Handle Submit Solution (Validates ALL test cases)
  const handleSubmit = async () => {
    if (!currentProblem || isRunning || isSubmitting) return;

    setIsSubmitting(true);
    setIsDrawerExpanded(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: currentProblem.id,
          language,
          code,
          userId: activeUser?.id
        })
      });

      const data = await res.json();
      if (data.success && data.result) {
        setSubmissionResult(data.result);

        const newSub = {
          id: data.submissionId,
          problemId: currentProblem.id,
          language,
          code,
          verdict: data.result.verdict,
          passedCount: data.result.passedCount,
          totalCount: data.result.totalCount,
          passPercentage: data.result.passPercentage,
          totalRuntimeMs: data.result.totalRuntimeMs,
          memoryMb: data.result.memoryMb,
          submittedAt: data.result.submittedAt
        };
        setSubmissions(prev => [newSub, ...prev]);

        if (data.result.verdict === 'Accepted') {
          setSolvedProblemIds(prev => Array.from(new Set([...prev, currentProblem.id])));

          if (data.rewards && data.rewards.pointsAwarded > 0) {
            confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
            setRewardToast({
              points: data.rewards.pointsAwarded,
              streak: data.rewards.streak,
              totalPoints: data.rewards.newPoints,
              title: currentProblem.title
            });
            setTimeout(() => setRewardToast(null), 6000);
            setActiveUser(prev => ({
              ...prev,
              points: data.rewards.newPoints,
              streak: data.rewards.streak,
              solvedProblemIds: data.rewards.solvedProblemIds || (prev?.solvedProblemIds ? [...prev.solvedProblemIds, currentProblem.id] : [currentProblem.id])
            }));
          } else if (data.rewards) {
            setActiveUser(prev => ({
              ...prev,
              streak: data.rewards.streak || prev?.streak
            }));
          }
        }
      } else {
        alert(data.message || 'Submission execution failed');
      }
    } catch (err) {
      console.error('Submit failed:', err);
      alert('Network or server error during evaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= VIEW: ADMIN PORTAL =================
  if (viewMode === 'admin') {
    return (
      <AdminPortal
        onBackToArena={() => {
          setViewMode('arena');
          fetchProblemsAndModules();
          fetchUsers();
        }}
        activeUserId={activeUser?.id}
        onSwitchActiveUser={handleSwitchUser}
      />
    );
  }

  // ================= VIEW: CODE ARENA (MENTEE SOLVER) =================
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0e1117] text-gray-100 font-sans">
      {/* 1. AlgoForge Navigation Bar */}
      <Navbar
        modules={modules}
        allModules={allModules}
        problems={problems}
        currentProblem={currentProblem}
        onSelectProblem={(id) => setCurrentProblemId(id)}
        onSelectModule={handleSelectModule}
        onOpenDoubtModal={() => setIsDoubtModalOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        activeUser={activeUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        solvedProblemIds={solvedProblemIds}
      />

      {/* 2. Main Workspace Split Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side: Problem Statement & Tabs */}
        {!isFullScreen && (
          <div 
            style={{ width: `${leftPaneWidth}%` }}
            className="h-full flex flex-col"
          >
            <ProblemPane
              problem={currentProblem}
              submissions={submissions}
              onViewSubmissionCode={(sub) => setViewingSubmission(sub)}
              onOpenDoubtModal={() => setIsDoubtModalOpen(true)}
              user={activeUser}
              onUnlockHint={handleUnlockHint}
            />
          </div>
        )}

        {/* Right Side: IDE & Console Runner */}
        <div 
          style={{ width: isFullScreen ? '100%' : `${100 - leftPaneWidth}%` }}
          className="h-full flex flex-col border-l border-[#1f2633]"
        >
          {/* Top: Code Editor */}
          <div className="flex-1 overflow-hidden">
            <EditorPane
              code={code}
              language={language}
              onCodeChange={handleCodeChange}
              onLanguageChange={handleLanguageChange}
              onResetCode={handleResetCode}
              isFullScreen={isFullScreen}
              onToggleFullScreen={() => setIsFullScreen(prev => !prev)}
            />
          </div>

          {/* Bottom: Console / Testcase Drawer */}
          <ConsoleDrawer
            sampleTestCases={currentProblem?.sampleTestCases || []}
            customInput={customInput}
            onCustomInputChange={setCustomInput}
            useCustomInput={useCustomInput}
            onToggleCustomInput={setUseCustomInput}
            onRun={handleRun}
            onSubmit={handleSubmit}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            runResult={runResult}
            submissionResult={submissionResult}
            isDrawerExpanded={isDrawerExpanded}
            onToggleDrawer={setIsDrawerExpanded}
          />
        </div>
      </div>

      {/* 3. Doubt Modal */}
      <DoubtModal
        isOpen={isDoubtModalOpen}
        onClose={() => setIsDoubtModalOpen(false)}
        problemId={currentProblem?.id}
        problemTitle={currentProblem?.title}
      />

      {/* 4. Past Submission Code Viewer Modal */}
      <SubmissionModal
        submission={viewingSubmission}
        onClose={() => setViewingSubmission(null)}
      />

      {/* 5. User Profile, Streak & Points Store Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={activeUser}
        onBuyFreeze={handleBuyFreeze}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* 6. Challenge Solved Points & Streak Reward Notification Banner */}
      {rewardToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#162032] border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl flex items-center space-x-3.5 animate-in slide-in-from-bottom duration-300 backdrop-blur-md">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">
            🎉
          </div>
          <div>
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Challenge Solved!
            </div>
            <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>+{rewardToast.points} pts awarded</span>
              <span className="text-orange-400 font-semibold">• {rewardToast.streak}d Streak 🔥</span>
            </div>
            <div className="text-[11px] text-gray-400">
              Total Points: <strong className="text-amber-300 font-bold">{rewardToast.totalPoints} pts</strong>
            </div>
          </div>
          <button 
            onClick={() => setRewardToast(null)}
            className="text-gray-400 hover:text-gray-200 ml-3 p-1 rounded-lg hover:bg-[#20293d] transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
