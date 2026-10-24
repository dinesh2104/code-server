import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from './store.js';
import { runTestCases } from './executor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve frontend build if available
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// Global active simulated user for student testing (default: admin with all access)
let currentActiveUserId = "usr_admin";

// ==========================================
// 1. PUBLIC / STUDENT APIS
// ==========================================

/**
 * GET /api/users/active
 * Returns current active simulated user
 */
app.get('/api/users/active', (req, res) => {
  const user = store.getUserById(currentActiveUserId) || store.getUsers()[0];
  res.json({ success: true, user });
});

/**
 * POST /api/users/active
 * Switch the active user (to test role-based module access)
 */
app.post('/api/users/active', (req, res) => {
  const { userId } = req.body;
  const user = store.getUserById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  currentActiveUserId = userId;
  res.json({ success: true, user });
});

/**
 * GET /api/problems
 * Returns list of problems and modules, filtered by user module access if specified
 */
app.get('/api/problems', (req, res) => {
  const userId = req.query.userId || currentActiveUserId;
  const user = store.getUserById(userId);

  const allModules = store.getModules();
  let userAccessibleModules = allModules;

  // If user has specific module restrictions
  if (user && user.role !== 'admin' && !user.accessibleModules.includes('all')) {
    userAccessibleModules = allModules.filter(m => user.accessibleModules.includes(m.id));
  }

  const allProblems = store.getProblems(user);
  const list = allProblems.map(p => ({
    id: p.id,
    moduleId: p.moduleId,
    category: p.category,
    title: p.title,
    difficulty: p.difficulty,
    score: p.score,
    tags: p.tags,
    author: p.author
  }));

  res.json({ 
    success: true, 
    problems: list, 
    modules: userAccessibleModules,
    allModules: allModules // full module list for navigation context
  });
});

/**
 * GET /api/modules
 * Returns list of DSA modules/categories
 */
app.get('/api/modules', (req, res) => {
  const modules = store.getModules();
  res.json({ success: true, modules });
});

/**
 * GET /api/problems/:id
 * Returns single problem with all details
 */
app.get('/api/problems/:id', (req, res) => {
  const problem = store.getProblemById(req.params.id);
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }

  // Hide the hiddenTestCases outputs from direct client retrieval
  const sanitized = {
    ...problem,
    hiddenTestCasesCount: problem.hiddenTestCases ? problem.hiddenTestCases.length : 0,
    sampleTestCases: problem.sampleTestCases || []
  };

  res.json({ success: true, problem: sanitized });
});

/**
 * POST /api/run
 * Execute against sample test cases or custom input
 */
app.post('/api/run', async (req, res) => {
  const { problemId, language, code, customInput } = req.body;
  const problem = store.getProblemById(problemId);

  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }

  if (!code || !language) {
    return res.status(400).json({ success: false, message: 'Missing code or language' });
  }

  let testCasesToRun = [];

  if (customInput && customInput.trim()) {
    testCasesToRun = [
      {
        id: 'custom',
        input: customInput.trim(),
        expectedOutput: null
      }
    ];
  } else {
    testCasesToRun = problem.sampleTestCases || [];
  }

  try {
    const result = await runTestCases({
      code,
      language,
      problem,
      testCases: testCasesToRun,
      isCustom: Boolean(customInput)
    });

    res.json({ success: true, result });
  } catch (error) {
    console.error('Run execution error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/submit
 * Validates against ALL test cases (Samples + Hidden)
 */
app.post('/api/submit', async (req, res) => {
  const { problemId, language, code, userId } = req.body;
  const problem = store.getProblemById(problemId);

  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }

  if (!code || !language) {
    return res.status(400).json({ success: false, message: 'Missing code or language' });
  }

  const activeUser = store.getUserById(userId || currentActiveUserId) || {
    id: "usr_guest",
    name: "Guest Mentee"
  };

  const allTestCases = [
    ...(problem.sampleTestCases || []).map(tc => ({ ...tc, isSample: true })),
    ...(problem.hiddenTestCases || []).map(tc => ({ ...tc, isSample: false }))
  ];

  try {
    const result = await runTestCases({
      code,
      language,
      problem,
      testCases: allTestCases,
      isCustom: false
    });

    const recorded = store.recordSubmission({
      userId: activeUser.id,
      userName: activeUser.name,
      problemId: problem.id,
      problemTitle: problem.title,
      moduleId: problem.moduleId,
      language,
      code,
      verdict: result.verdict,
      passedCount: result.passedCount,
      totalCount: result.totalCount,
      passPercentage: result.passPercentage,
      totalRuntimeMs: result.totalRuntimeMs,
      memoryMb: result.memoryMb,
      submittedAt: result.submittedAt
    });

    // Award Points & Maintain Streak when solution is Accepted
    let rewards = null;
    if (result.verdict === 'Accepted') {
      rewards = store.awardSolveRewards(activeUser.id, problem);
    }

    res.json({
      success: true,
      result,
      rewards,
      submissionId: recorded.id
    });
  } catch (error) {
    console.error('Submission execution error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/user/buy-freeze
 * Buy a streak freeze using earned points (Cost: 100 pts)
 */
app.post('/api/user/buy-freeze', (req, res) => {
  try {
    const userId = req.body.userId || currentActiveUserId;
    const cost = req.body.cost || 100;
    const result = store.buyStreakFreeze(userId, cost);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/user/unlock-hint
 * Unlock a problem hint using earned points (Cost: 25 pts)
 */
app.post('/api/user/unlock-hint', (req, res) => {
  try {
    const userId = req.body.userId || currentActiveUserId;
    const { problemId, hintIndex, cost } = req.body;
    if (hintIndex === undefined || !problemId) {
      return res.status(400).json({ success: false, message: 'Missing problemId or hintIndex' });
    }
    const result = store.unlockHint(userId, problemId, Number(hintIndex), cost || 25);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/user/profile
 * Get active user profile, points, streak, and unlocked hints
 */
app.get('/api/user/profile', (req, res) => {
  try {
    const userId = req.query.userId || currentActiveUserId;
    const user = store.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/user/profile
 * Normal user profile update (Name, Bio, College, Target Role, Preferred Language, GitHub, LinkedIn)
 */
app.put('/api/user/profile', (req, res) => {
  try {
    const userId = req.body.userId || currentActiveUserId;
    const updated = store.updateUserProfile(userId, req.body);
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/submissions/:problemId
 * Get submission history for a problem
 */
app.get('/api/submissions/:problemId', (req, res) => {
  const list = store.getSubmissions(req.params.problemId);
  res.json({ success: true, submissions: list });
});

// ==========================================
// 2. ADMIN PANEL APIS (RESTRICTED TO ADMINS)
// ==========================================

// Authorization Middleware: Ensures only users with 'admin' role can access admin endpoints
const requireAdmin = (req, res, next) => {
  const requesterId = req.headers['x-user-id'] || req.query.userId || req.body?.requesterId || currentActiveUserId;
  const user = store.getUserById(requesterId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Student accounts do not have permission to access the Administrator Console.'
    });
  }
  next();
};

/**
 * GET /api/admin/stats
 * Complete statistics, usage, and module utilization metrics
 */
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const stats = store.getStats();
  res.json({ success: true, stats });
});

/**
 * GET /api/admin/problems
 * List all problems with complete details for administration
 */
app.get('/api/admin/problems', requireAdmin, (req, res) => {
  const problems = store.getProblems();
  res.json({ success: true, problems });
});

/**
 * POST /api/admin/problems
 * Create new question (GeeksforGeeks-style challenge creator)
 */
app.post('/api/admin/problems', requireAdmin, (req, res) => {
  try {
    const newProblem = store.createProblem(req.body);
    res.status(201).json({ success: true, problem: newProblem });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/admin/problems/:id
 * Edit question / Reassign module
 */
app.put('/api/admin/problems/:id', requireAdmin, (req, res) => {
  try {
    const updated = store.updateProblem(req.params.id, req.body);
    res.json({ success: true, problem: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/admin/problems/:id
 * Delete a question
 */
app.delete('/api/admin/problems/:id', requireAdmin, (req, res) => {
  try {
    store.deleteProblem(req.params.id);
    res.json({ success: true, message: 'Problem deleted successfully.' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/admin/modules
 * List all modules
 */
app.get('/api/admin/modules', requireAdmin, (req, res) => {
  const modules = store.getModules();
  res.json({ success: true, modules });
});

/**
 * POST /api/admin/modules
 * Create a new module
 */
app.post('/api/admin/modules', requireAdmin, (req, res) => {
  try {
    const newModule = store.createModule(req.body);
    res.status(201).json({ success: true, module: newModule });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/admin/modules/:id
 * Update an existing module
 */
app.put('/api/admin/modules/:id', requireAdmin, (req, res) => {
  try {
    const updated = store.updateModule(req.params.id, req.body);
    res.json({ success: true, module: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/admin/modules/:id
 * Delete a module
 */
app.delete('/api/admin/modules/:id', requireAdmin, (req, res) => {
  try {
    store.deleteModule(req.params.id);
    res.json({ success: true, message: 'Module deleted successfully.' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/admin/users
 * List all users with accessible module stats and performance
 */
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const users = store.getUsers();
  res.json({ success: true, users });
});

/**
 * POST /api/admin/users
 * Create a new user with module permissions
 */
app.post('/api/admin/users', requireAdmin, (req, res) => {
  try {
    const newUser = store.createUser(req.body);
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * PUT /api/admin/users/:id
 * Update user details or module permissions
 */
app.put('/api/admin/users/:id', requireAdmin, (req, res) => {
  try {
    const updated = store.updateUser(req.params.id, req.body);
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete a user
 */
app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
  try {
    store.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Single-page application route fallback
app.use((req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AlgoForge Code Judge & Admin Server running on http://localhost:${PORT}`);
});
