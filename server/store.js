import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { problems as initialProblems, modules as initialModules } from './problems.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data_store.json');

// Default Seed Users with Points, Streaks & Gamification Features
const initialUsers = [
  {
    id: "usr_admin",
    name: "Admin Dinesh",
    email: "admin@algoforge.com",
    role: "admin",
    accessibleModules: ["all"],
    status: "active",
    points: 450,
    streak: 14,
    streakFreezes: 2,
    bio: "Lead Systems Architect & Competitive Programming Mentor at AlgoForge. Managing core curriculum and online judge infrastructure.",
    college: "AlgoForge Engineering Team",
    preferredLanguage: "python",
    targetRole: "System Superadministrator",
    github: "dineshadm",
    linkedin: "in/dineshadm",
    solvedProblemIds: ["10", "4705"],
    unlockedHints: {},
    createdAt: "2026-10-01T08:00:00Z",
    notes: "System Superadministrator with unrestricted platform access."
  },
  {
    id: "usr_sarah",
    name: "Sarah Chen",
    email: "sarah.chen@stanford.edu",
    role: "student",
    accessibleModules: ["all"],
    status: "active",
    points: 350,
    streak: 11,
    streakFreezes: 1,
    bio: "Computer Science junior focusing on graph algorithms, dynamic programming, and FAANG technical interview prep.",
    college: "Stanford University",
    preferredLanguage: "python",
    targetRole: "Software Engineer (SDE-1)",
    github: "sarahc-dev",
    linkedin: "in/sarahchen-cs",
    solvedProblemIds: ["4705", "249"],
    unlockedHints: {},
    createdAt: "2026-10-10T14:20:00Z",
    notes: "Full DSA Track mentee preparing for FAANG interviews."
  },
  {
    id: "usr_alex",
    name: "Alex Rivera",
    email: "alex.rivera@berkeley.edu",
    role: "student",
    accessibleModules: ["arrays", "strings", "sorting", "binary_search", "dynamic_programming"],
    status: "active",
    points: 200,
    streak: 6,
    streakFreezes: 1,
    bio: "Passionate full-stack developer tackling 2 DSA problems daily to master algorithmic thinking.",
    college: "UC Berkeley",
    preferredLanguage: "javascript",
    targetRole: "Full Stack Engineer",
    github: "alexr-code",
    linkedin: "in/alexrivera-dev",
    solvedProblemIds: ["10", "104"],
    unlockedHints: {},
    createdAt: "2026-10-14T09:15:00Z",
    notes: "Enrolled in Beginner to Intermediate DSA Bootcamp."
  },
  {
    id: "usr_priya",
    name: "Priya Sharma",
    email: "priya.sharma@techinst.ac.in",
    role: "student",
    accessibleModules: ["arrays", "linked_lists", "stacks_and_queues", "trees", "hashing"],
    status: "active",
    points: 180,
    streak: 4,
    streakFreezes: 0,
    bio: "Data structures enthusiast focusing on tree traversals, recursion, and spatial optimization.",
    college: "Tech Institute of Technology",
    preferredLanguage: "cpp",
    targetRole: "Backend Engineer",
    github: "priyasharma-algo",
    linkedin: "in/priyasharma-tech",
    solvedProblemIds: ["315"],
    unlockedHints: {},
    createdAt: "2026-10-18T16:45:00Z",
    notes: "Core Data Structures cohort."
  },
  {
    id: "usr_vikram",
    name: "Vikram Malhotra",
    email: "vikram.m@engineer.io",
    role: "student",
    accessibleModules: ["graphs", "dynamic_programming", "two_pointers", "bit_manipulation"],
    status: "active",
    points: 120,
    streak: 2,
    streakFreezes: 0,
    bio: "Contest participant & competitive programmer grinding bit manipulation and shortest path problems.",
    college: "Institute of Engineering",
    preferredLanguage: "cpp",
    targetRole: "Systems Engineer",
    github: "vikram-coder",
    linkedin: "in/vikrammalhotra",
    solvedProblemIds: ["427"],
    unlockedHints: {},
    createdAt: "2026-10-21T11:20:00Z",
    notes: "Advanced competitive programming module track."
  }
];

// Initial Realistic Submissions for Analytics
const initialSubmissions = [
  {
    id: "sub_seed_1",
    userId: "usr_sarah",
    userName: "Sarah Chen",
    problemId: "4705",
    problemTitle: "Rain Water Trapped",
    moduleId: "arrays",
    language: "python",
    verdict: "Accepted",
    passedCount: 12,
    totalCount: 12,
    passPercentage: 100,
    totalRuntimeMs: 0.08,
    memoryMb: "14.2 MB",
    submittedAt: "2026-10-22T14:32:00Z"
  },
  {
    id: "sub_seed_2",
    userId: "usr_alex",
    userName: "Alex Rivera",
    problemId: "10",
    problemTitle: "Reverse the Array",
    moduleId: "arrays",
    language: "python",
    verdict: "Accepted",
    passedCount: 6,
    totalCount: 6,
    passPercentage: 100,
    totalRuntimeMs: 0.02,
    memoryMb: "13.8 MB",
    submittedAt: "2026-10-22T16:15:00Z"
  },
  {
    id: "sub_seed_3",
    userId: "usr_priya",
    userName: "Priya Sharma",
    problemId: "315",
    problemTitle: "Palindrome List",
    moduleId: "linked_lists",
    language: "javascript",
    verdict: "Accepted",
    passedCount: 7,
    totalCount: 7,
    passPercentage: 100,
    totalRuntimeMs: 0.05,
    memoryMb: "15.1 MB",
    submittedAt: "2026-10-23T09:10:00Z"
  },
  {
    id: "sub_seed_4",
    userId: "usr_vikram",
    userName: "Vikram Malhotra",
    problemId: "427",
    problemTitle: "Stairs (Climbing Stairs)",
    moduleId: "dynamic_programming",
    language: "python",
    verdict: "Wrong Answer",
    passedCount: 4,
    totalCount: 7,
    passPercentage: 57,
    totalRuntimeMs: 0.04,
    memoryMb: "14.0 MB",
    submittedAt: "2026-10-23T11:45:00Z"
  },
  {
    id: "sub_seed_5",
    userId: "usr_vikram",
    userName: "Vikram Malhotra",
    problemId: "427",
    problemTitle: "Stairs (Climbing Stairs)",
    moduleId: "dynamic_programming",
    language: "python",
    verdict: "Accepted",
    passedCount: 7,
    totalCount: 7,
    passPercentage: 100,
    totalRuntimeMs: 0.03,
    memoryMb: "14.1 MB",
    submittedAt: "2026-10-23T12:02:00Z"
  },
  {
    id: "sub_seed_6",
    userId: "usr_alex",
    userName: "Alex Rivera",
    problemId: "104",
    problemTitle: "Reverse the String",
    moduleId: "strings",
    language: "javascript",
    verdict: "Accepted",
    passedCount: 6,
    totalCount: 6,
    passPercentage: 100,
    totalRuntimeMs: 0.04,
    memoryMb: "14.6 MB",
    submittedAt: "2026-10-23T15:20:00Z"
  },
  {
    id: "sub_seed_7",
    userId: "usr_sarah",
    userName: "Sarah Chen",
    problemId: "249",
    problemTitle: "Sorted Insert Position",
    moduleId: "binary_search",
    language: "python",
    verdict: "Accepted",
    passedCount: 6,
    totalCount: 6,
    passPercentage: 100,
    totalRuntimeMs: 0.02,
    memoryMb: "13.9 MB",
    submittedAt: "2026-10-23T18:10:00Z"
  }
];

class DataStore {
  constructor() {
    this.data = {
      modules: [...initialModules],
      problems: [...initialProblems],
      users: [...initialUsers],
      submissions: [...initialSubmissions]
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.modules && parsed.problems && parsed.users) {
          this.data = parsed;
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load data_store.json, using defaults:', e);
    }
    this.save();
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write data_store.json:', e);
    }
  }

  // --- MODULES ---
  getModules() {
    return this.data.modules.map(m => {
      const probCount = this.data.problems.filter(p => p.moduleId === m.id).length;
      return { ...m, count: probCount };
    });
  }

  getModuleById(id) {
    return this.data.modules.find(m => m.id === id);
  }

  createModule({ name, description, icon }) {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    if (this.data.modules.some(m => m.id === id)) {
      throw new Error(`Module with ID '${id}' already exists.`);
    }
    const newModule = {
      id,
      name,
      shortName: name,
      description: description || `Module focusing on ${name} algorithmic paradigms and data structures.`,
      icon: icon || 'Layers',
      count: 0,
      createdAt: new Date().toISOString()
    };
    this.data.modules.push(newModule);
    this.save();
    return newModule;
  }

  updateModule(id, { name, description, icon }) {
    const idx = this.data.modules.findIndex(m => m.id === id);
    if (idx === -1) throw new Error('Module not found');
    if (name) this.data.modules[idx].name = name;
    if (description !== undefined) this.data.modules[idx].description = description;
    if (icon) this.data.modules[idx].icon = icon;
    this.save();
    return this.data.modules[idx];
  }

  deleteModule(id) {
    const problemsInModule = this.data.problems.filter(p => p.moduleId === id);
    if (problemsInModule.length > 0) {
      throw new Error(`Cannot delete module '${id}'. It still contains ${problemsInModule.length} question(s). Reassign them first.`);
    }
    this.data.modules = this.data.modules.filter(m => m.id !== id);
    // Remove from users' accessibleModules
    this.data.users.forEach(u => {
      if (Array.isArray(u.accessibleModules)) {
        u.accessibleModules = u.accessibleModules.filter(mId => mId !== id);
      }
    });
    this.save();
    return true;
  }

  // --- PROBLEMS ---
  getProblems(user = null) {
    let list = this.data.problems;
    // Filter by user's accessible modules if specified and not admin
    if (user && user.role !== 'admin' && !user.accessibleModules.includes('all')) {
      list = list.filter(p => user.accessibleModules.includes(p.moduleId));
    }
    return list;
  }

  getProblemById(id) {
    return this.data.problems.find(p => p.id === id);
  }

  createProblem(problemData) {
    // Generate an ID if not given
    const newId = problemData.id || `${Date.now() % 100000}`;
    if (this.data.problems.some(p => p.id === newId)) {
      throw new Error(`Problem with ID '${newId}' already exists.`);
    }

    const targetModule = this.data.modules.find(m => m.id === problemData.moduleId);
    const category = targetModule ? targetModule.name : (problemData.category || "General");

    const newProblem = {
      id: newId,
      moduleId: problemData.moduleId,
      category,
      title: problemData.title,
      difficulty: problemData.difficulty || "Medium",
      score: Number(problemData.score) || 100,
      timeLimitMs: Number(problemData.timeLimitMs) || 2000,
      tags: Array.isArray(problemData.tags) ? problemData.tags : (problemData.tags || "").split(',').map(t => t.trim()).filter(Boolean),
      author: problemData.author || "AlgoForge",
      description: problemData.description || "",
      constraints: problemData.constraints || "* 1 <= N <= 10^5",
      inputFormat: problemData.inputFormat || "Standard input format.",
      outputFormat: problemData.outputFormat || "Standard output format.",
      examples: problemData.examples || [],
      sampleTestCases: problemData.sampleTestCases || [],
      hiddenTestCases: problemData.hiddenTestCases || [],
      starterCodes: problemData.starterCodes || {
        python: `class Solution:\n    def solve(self, A):\n        # Write your code here\n        pass\n`,
        javascript: `module.exports = {\n    solve: function(A) {\n        // Write your code here\n        return 0;\n    }\n};`
      },
      hints: problemData.hints || [],
      editorial: problemData.editorial || "Editorial solution and optimal approach.",
      createdAt: new Date().toISOString()
    };

    this.data.problems.unshift(newProblem);
    this.save();
    return newProblem;
  }

  updateProblem(id, updates) {
    const idx = this.data.problems.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Problem not found');

    const current = this.data.problems[idx];
    if (updates.moduleId && updates.moduleId !== current.moduleId) {
      const targetModule = this.data.modules.find(m => m.id === updates.moduleId);
      updates.category = targetModule ? targetModule.name : current.category;
    }

    this.data.problems[idx] = {
      ...current,
      ...updates,
      id: current.id // ID cannot change
    };

    this.save();
    return this.data.problems[idx];
  }

  deleteProblem(id) {
    const initialLen = this.data.problems.length;
    this.data.problems = this.data.problems.filter(p => p.id !== id);
    if (this.data.problems.length === initialLen) {
      throw new Error('Problem not found');
    }
    this.save();
    return true;
  }

  // --- USERS & ACCESS MANAGEMENT ---
  getUsers() {
    return this.data.users.map(u => {
      const userSubs = this.data.submissions.filter(s => s.userId === u.id);
      const solvedCount = new Set(userSubs.filter(s => s.verdict === 'Accepted').map(s => s.problemId)).size;
      return {
        ...u,
        totalSubmissions: userSubs.length,
        solvedCount,
        lastActive: userSubs.length > 0 ? userSubs[0].submittedAt : u.createdAt
      };
    });
  }

  getUserById(id) {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return null;
    const userSubs = this.data.submissions.filter(s => s.userId === user.id);
    const solvedCount = new Set(userSubs.filter(s => s.verdict === 'Accepted').map(s => s.problemId)).size;
    const acceptedCount = userSubs.filter(s => s.verdict === 'Accepted').length;
    const acceptanceRate = userSubs.length > 0 ? Math.round((acceptedCount / userSubs.length) * 100) : 0;

    return {
      bio: user.bio || (user.role === 'admin' ? "Lead Systems Architect & Competitive Programming Mentor at AlgoForge. Managing core curriculum and online judge infrastructure." : "Passionate student mentee solving algorithms and data structures."),
      college: user.college || (user.role === 'admin' ? "AlgoForge Core Engineering" : "Technical University"),
      preferredLanguage: user.preferredLanguage || "python",
      targetRole: user.targetRole || (user.role === 'admin' ? "System Superadministrator" : "Software Engineer (SDE-1)"),
      github: user.github || (user.role === 'admin' ? "dineshadm" : `${user.id}_dev`),
      linkedin: user.linkedin || (user.role === 'admin' ? "in/dineshadm" : `in/${user.id}`),
      points: 100,
      streak: 1,
      streakFreezes: 0,
      solvedProblemIds: [],
      unlockedHints: {},
      ...user,
      totalSubmissions: userSubs.length,
      solvedCount,
      acceptanceRate
    };
  }

  updateUserProfile(userId, profileData) {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const allowedFields = ['name', 'bio', 'college', 'preferredLanguage', 'targetRole', 'github', 'linkedin'];
    allowedFields.forEach(f => {
      if (profileData[f] !== undefined) {
        user[f] = profileData[f];
      }
    });

    if (user.role === 'admin' && profileData.notes !== undefined) {
      user.notes = profileData.notes;
    }

    this.save();
    return this.getUserById(userId);
  }

  // --- GAMIFICATION: POINTS, STREAK, FREEZE, HINTS ---
  awardSolveRewards(userId, problem) {
    let user = this.data.users.find(u => u.id === userId);
    if (!user) {
      user = this.data.users[0]; // fallback
    }

    // Default missing fields
    if (user.points === undefined) user.points = 100;
    if (user.streak === undefined) user.streak = 1;
    if (user.streakFreezes === undefined) user.streakFreezes = 0;
    if (!Array.isArray(user.solvedProblemIds)) user.solvedProblemIds = [];
    if (!user.unlockedHints) user.unlockedHints = {};

    const alreadySolved = user.solvedProblemIds.includes(problem.id);
    const pointsAwarded = alreadySolved ? 0 : (Number(problem.score) || 100);

    if (!alreadySolved) {
      user.solvedProblemIds.push(problem.id);
      user.points += pointsAwarded;

      // Update streak
      const today = new Date().toISOString().slice(0, 10);
      if (user.lastSolvedDate !== today) {
        user.streak = (user.streak || 0) + 1;
        user.lastSolvedDate = today;
      }
    }

    this.save();
    return {
      alreadySolved,
      pointsAwarded,
      newPoints: user.points,
      streak: user.streak,
      streakFreezes: user.streakFreezes,
      solvedProblemIds: user.solvedProblemIds
    };
  }

  buyStreakFreeze(userId, cost = 100) {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    if (user.points === undefined) user.points = 100;
    if (user.streakFreezes === undefined) user.streakFreezes = 0;

    if (user.points < cost) {
      throw new Error(`Insufficient points. Streak Freeze costs ${cost} points, but you have ${user.points} points.`);
    }

    user.points -= cost;
    user.streakFreezes += 1;
    this.save();

    return {
      success: true,
      points: user.points,
      streakFreezes: user.streakFreezes,
      streak: user.streak || 1
    };
  }

  unlockHint(userId, problemId, hintIndex, cost = 25) {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    if (user.points === undefined) user.points = 100;
    if (!user.unlockedHints) user.unlockedHints = {};
    if (!Array.isArray(user.unlockedHints[problemId])) {
      user.unlockedHints[problemId] = [];
    }

    // Check if already unlocked
    if (user.unlockedHints[problemId].includes(hintIndex)) {
      return {
        success: true,
        alreadyUnlocked: true,
        unlockedHints: user.unlockedHints[problemId],
        points: user.points
      };
    }

    if (user.points < cost) {
      throw new Error(`Insufficient points! Unlocking Hint ${hintIndex + 1} costs ${cost} points. You have ${user.points} points.`);
    }

    user.points -= cost;
    user.unlockedHints[problemId].push(hintIndex);
    this.save();

    return {
      success: true,
      alreadyUnlocked: false,
      cost,
      points: user.points,
      unlockedHints: user.unlockedHints[problemId]
    };
  }

  createUser({ name, email, role = 'student', accessibleModules = ['all'], notes = '' }) {
    if (this.data.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error(`User with email '${email}' already exists.`);
    }
    const id = `usr_${Date.now() % 1000000}`;
    const newUser = {
      id,
      name,
      email,
      role: role === 'admin' ? 'admin' : 'student',
      accessibleModules: Array.isArray(accessibleModules) ? accessibleModules : ['all'],
      status: 'active',
      notes,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('User not found');

    const current = this.data.users[idx];
    this.data.users[idx] = {
      ...current,
      ...updates,
      id: current.id
    };
    this.save();
    return this.data.users[idx];
  }

  deleteUser(id) {
    if (id === 'usr_admin') {
      throw new Error('Cannot delete primary Administrator.');
    }
    this.data.users = this.data.users.filter(u => u.id !== id);
    this.save();
    return true;
  }

  // --- SUBMISSIONS & ANALYTICS ---
  recordSubmission(sub) {
    const entry = {
      id: sub.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId: sub.userId || 'usr_admin',
      userName: sub.userName || 'Admin Dinesh',
      problemId: sub.problemId,
      problemTitle: sub.problemTitle || `Problem #${sub.problemId}`,
      moduleId: sub.moduleId || 'arrays',
      language: sub.language,
      code: sub.code,
      verdict: sub.verdict,
      passedCount: sub.passedCount,
      totalCount: sub.totalCount,
      passPercentage: sub.passPercentage,
      totalRuntimeMs: sub.totalRuntimeMs,
      memoryMb: sub.memoryMb,
      submittedAt: sub.submittedAt || new Date().toISOString()
    };

    this.data.submissions.unshift(entry);
    // Keep max 200 submissions
    if (this.data.submissions.length > 200) {
      this.data.submissions = this.data.submissions.slice(0, 200);
    }
    this.save();
    return entry;
  }

  getSubmissions(problemId = null, userId = null) {
    let list = this.data.submissions;
    if (problemId) list = list.filter(s => s.problemId === problemId);
    if (userId) list = list.filter(s => s.userId === userId);
    return list;
  }

  // Detailed Utilization & Statistics for Admin
  getStats() {
    const totalUsers = this.data.users.length;
    const activeUsers = this.data.users.filter(u => u.status === 'active').length;
    const totalProblems = this.data.problems.length;
    const totalModules = this.data.modules.length;
    const totalSubmissions = this.data.submissions.length;
    const acceptedCount = this.data.submissions.filter(s => s.verdict === 'Accepted').length;
    const globalAcceptanceRate = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0;

    // Difficulty breakdown
    const difficultyBreakdown = {
      Easy: this.data.problems.filter(p => p.difficulty === 'Easy').length,
      Medium: this.data.problems.filter(p => p.difficulty === 'Medium').length,
      Hard: this.data.problems.filter(p => p.difficulty === 'Hard').length
    };

    // Module Utilization: calculate attempts, completions, and user reach
    const moduleUtilization = this.data.modules.map(mod => {
      const modProblems = this.data.problems.filter(p => p.moduleId === mod.id);
      const modSubs = this.data.submissions.filter(s => s.moduleId === mod.id);
      const acceptedSubs = modSubs.filter(s => s.verdict === 'Accepted');
      const uniqueUsersAttempted = new Set(modSubs.map(s => s.userId)).size;
      const uniqueProblemsSolved = new Set(acceptedSubs.map(s => s.problemId)).size;

      // Calculate how many users have access to this module
      const usersWithAccess = this.data.users.filter(u => 
        u.accessibleModules.includes('all') || u.accessibleModules.includes(mod.id)
      ).length;

      return {
        moduleId: mod.id,
        moduleName: mod.name,
        totalProblems: modProblems.length,
        totalAttempts: modSubs.length,
        acceptedAttempts: acceptedSubs.length,
        uniqueUsersAttempted,
        usersWithAccess,
        completionRate: modProblems.length > 0 ? Math.round((uniqueProblemsSolved / modProblems.length) * 100) : 0
      };
    });

    // Recent Activity feed
    const recentActivity = this.data.submissions.slice(0, 10).map(s => ({
      id: s.id,
      userId: s.userId,
      userName: s.userName,
      problemId: s.problemId,
      problemTitle: s.problemTitle,
      moduleId: s.moduleId,
      verdict: s.verdict,
      passPercentage: s.passPercentage,
      runtimeMs: s.totalRuntimeMs,
      timeAgo: s.submittedAt
    }));

    return {
      totalUsers,
      activeUsers,
      totalProblems,
      totalModules,
      totalSubmissions,
      acceptedCount,
      globalAcceptanceRate,
      difficultyBreakdown,
      moduleUtilization,
      recentActivity
    };
  }
}

export const store = new DataStore();
