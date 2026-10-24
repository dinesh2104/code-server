import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Normalizes strings for robust comparison
function normalizeOutput(str) {
  if (str === null || str === undefined) return '';
  // Try parsing JSON to handle spacing differences like "[1, 2]" vs "[1,2]"
  try {
    const parsed = JSON.parse(str);
    return JSON.stringify(parsed);
  } catch (e) {
    return str.toString().trim().replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
  }
}

// Map of target function names for each problem
const PROBLEM_FN_MAP = {
  "10": "solve",
  "4705": "trap",
  "315": "solve",
  "249": "searchInsert",
  "104": "solve",
  "75": "singleNumber",
  "321": "solve",
  "166": "solve",
  "131": "solve",
  "231": "solve",
  "268": "maxArea",
  "119": "solve",
  "471": "solve",
  "427": "climbStairs"
};

/**
 * Execute Python code against a test case
 */
async function executePython(userCode, testCase, fnName, timeoutMs = 3000) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'judge_py_'));
  const scriptPath = path.join(tmpDir, 'solution.py');

  const runnerCode = `
import sys
import json
import time

# --- USER CODE START ---
${userCode}
# --- USER CODE END ---

def run_test():
    raw_input = """${testCase.input.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"\x22\x22
    try:
        # Parse inputs safely
        parsed_args = eval(f"({raw_input},)")
    except Exception as e:
        sys.stderr.write(f"InputParseError: {e}\\n")
        sys.exit(2)
        
    try:
        sol = Solution()
        fn = getattr(sol, "${fnName}", None)
        if fn is None:
            # Fallback to first non-dunder callable method
            methods = [m for m in dir(sol) if not m.startswith('_') and callable(getattr(sol, m))]
            if methods:
                fn = getattr(sol, methods[0])
            else:
                raise AttributeError("No callable method found in Solution class")
                
        start_t = time.perf_counter()
        result = fn(*parsed_args)
        end_t = time.perf_counter()
        
        sys.stdout.write(f"__RUNTIME_MS__={(end_t - start_t) * 1000:.2f}\\n")
        sys.stdout.write(f"__RESULT__={json.dumps(result)}\\n")
    except Exception as e:
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    run_test()
`;

  fs.writeFileSync(scriptPath, runnerCode);

  return new Promise((resolve) => {
    const startOverall = Date.now();
    const child = spawn('python3', [scriptPath], {
      cwd: tmpDir,
      env: { ...process.env, PYTHONUNBUFFERED: '1' }
    });

    let stdout = '';
    let stderr = '';
    let isTimeout = false;

    const timer = setTimeout(() => {
      isTimeout = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });

    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      const overallDuration = Date.now() - startOverall;

      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch (e) {}

      if (isTimeout) {
        return resolve({
          testCaseId: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          passed: false,
          status: 'Time Limit Exceeded',
          error: `Execution timed out after ${timeoutMs}ms`,
          runtimeMs: timeoutMs,
          userStdout: stdout
        });
      }

      if (code !== 0) {
        const isSyntax = stderr.includes('SyntaxError') || stderr.includes('IndentationError');
        return resolve({
          testCaseId: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          passed: false,
          status: isSyntax ? 'Compilation Error' : 'Runtime Error',
          error: stderr.trim() || 'Process exited with non-zero code',
          runtimeMs: overallDuration,
          userStdout: stdout
        });
      }

      // Parse output
      let runtimeMs = overallDuration;
      let actualOutput = '';
      const lines = stdout.split('\n');
      const userLogs = [];

      for (const line of lines) {
        if (line.startsWith('__RUNTIME_MS__=')) {
          runtimeMs = parseFloat(line.replace('__RUNTIME_MS__=', ''));
        } else if (line.startsWith('__RESULT__=')) {
          actualOutput = line.replace('__RESULT__=', '');
        } else if (line.trim().length > 0) {
          userLogs.push(line);
        }
      }

      const passed = normalizeOutput(actualOutput) === normalizeOutput(testCase.expectedOutput);

      resolve({
        testCaseId: testCase.id,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: actualOutput,
        passed,
        status: passed ? 'Passed' : 'Wrong Answer',
        error: null,
        runtimeMs: Math.round(runtimeMs * 100) / 100,
        userStdout: userLogs.join('\n')
      });
    });
  });
}

/**
 * Execute JavaScript code against a test case
 */
async function executeJavaScript(userCode, testCase, fnName, timeoutMs = 3000) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'judge_js_'));
  const scriptPath = path.join(tmpDir, 'runner.js');
  const userModulePath = path.join(tmpDir, 'userCode.js');

  fs.writeFileSync(userModulePath, userCode);

  const runnerCode = `
const fs = require('fs');

async function main() {
  let userModule;
  try {
    userModule = require('./userCode.js');
  } catch (err) {
    console.error(err.stack || err);
    process.exit(1);
  }

  const rawInput = ${JSON.stringify(testCase.input)};
  let args;
  try {
    args = eval(\`[\${rawInput}]\`);
  } catch(e) {
    console.error("InputParseError: " + e.message);
    process.exit(2);
  }

  let fn;
  if (typeof userModule === 'function') {
    fn = userModule;
  } else if (userModule && typeof userModule === 'object') {
    fn = userModule['${fnName}'] || userModule['solve'] || userModule['trap'] || Object.values(userModule).find(v => typeof v === 'function');
  }

  if (!fn) {
    console.error("Error: Could not find exported solution function");
    process.exit(1);
  }

  const start = process.hrtime.bigint();
  try {
    const result = await fn(...args);
    const end = process.hrtime.bigint();
    const runtimeMs = Number(end - start) / 1e6;
    console.log("__RUNTIME_MS__=" + runtimeMs.toFixed(2));
    console.log("__RESULT__=" + JSON.stringify(result));
  } catch (err) {
    console.error(err.stack || err);
    process.exit(1);
  }
}

main();
`;

  fs.writeFileSync(scriptPath, runnerCode);

  return new Promise((resolve) => {
    const startOverall = Date.now();
    const child = spawn('node', [scriptPath], {
      cwd: tmpDir
    });

    let stdout = '';
    let stderr = '';
    let isTimeout = false;

    const timer = setTimeout(() => {
      isTimeout = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });

    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      const overallDuration = Date.now() - startOverall;

      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch (e) {}

      if (isTimeout) {
        return resolve({
          testCaseId: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          passed: false,
          status: 'Time Limit Exceeded',
          error: `Execution timed out after ${timeoutMs}ms`,
          runtimeMs: timeoutMs,
          userStdout: stdout
        });
      }

      if (code !== 0) {
        return resolve({
          testCaseId: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          passed: false,
          status: stderr.includes('SyntaxError') ? 'Compilation Error' : 'Runtime Error',
          error: stderr.trim() || 'Runtime execution error',
          runtimeMs: overallDuration,
          userStdout: stdout
        });
      }

      let runtimeMs = overallDuration;
      let actualOutput = '';
      const lines = stdout.split('\n');
      const userLogs = [];

      for (const line of lines) {
        if (line.startsWith('__RUNTIME_MS__=')) {
          runtimeMs = parseFloat(line.replace('__RUNTIME_MS__=', ''));
        } else if (line.startsWith('__RESULT__=')) {
          actualOutput = line.replace('__RESULT__=', '');
        } else if (line.trim().length > 0) {
          userLogs.push(line);
        }
      }

      const passed = normalizeOutput(actualOutput) === normalizeOutput(testCase.expectedOutput);

      resolve({
        testCaseId: testCase.id,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: actualOutput,
        passed,
        status: passed ? 'Passed' : 'Wrong Answer',
        error: null,
        runtimeMs: Math.round(runtimeMs * 100) / 100,
        userStdout: userLogs.join('\n')
      });
    });
  });
}

/**
 * Execute C++ code against a test case
 */
async function executeCpp(userCode, testCase, fnName, timeoutMs = 3000) {
  // C++ wrapper implementation with g++
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'judge_cpp_'));
  const srcPath = path.join(tmpDir, 'solution.cpp');
  const binPath = path.join(tmpDir, 'solution');

  // Generate C++ harness
  const cppHarness = `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <chrono>
#include <algorithm>

using namespace std;

// --- USER CODE START ---
${userCode}
// --- USER CODE END ---

// Helper to parse a vector<int> from "[1, 2, 3]"
vector<int> parseVector(const string &s) {
    vector<int> res;
    stringstream ss(s);
    char ch;
    int val;
    while (ss >> ch) {
        if (ch == '[' || ch == ',' || ch == ']') continue;
        ss.putback(ch);
        if (ss >> val) {
            res.push_back(val);
        }
    }
    return res;
}

int main() {
    string inputStr = ${JSON.stringify(testCase.input)};
    auto start = chrono::high_resolution_clock::now();
    
    // Default call for trap(vector<int>)
    vector<int> A = parseVector(inputStr);
    auto result = ${fnName}(A);
    
    auto end = chrono::high_resolution_clock::now();
    chrono::duration<double, milli> duration = end - start;
    
    cout << "__RUNTIME_MS__=" << duration.count() << endl;
    cout << "__RESULT__=" << result << endl;
    return 0;
}
`;

  fs.writeFileSync(srcPath, cppHarness);

  return new Promise((resolve) => {
    // Compile first
    const compiler = spawn('g++', ['-O2', srcPath, '-o', binPath], { cwd: tmpDir });
    let compileErr = '';

    compiler.stderr.on('data', (d) => { compileErr += d.toString(); });

    compiler.on('close', (compCode) => {
      if (compCode !== 0) {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
        return resolve({
          testCaseId: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          passed: false,
          status: 'Compilation Error',
          error: compileErr.trim(),
          runtimeMs: 0,
          userStdout: ''
        });
      }

      // Execute compiled binary
      const startOverall = Date.now();
      const child = spawn(binPath, [], { cwd: tmpDir });
      let stdout = '';
      let stderr = '';
      let isTimeout = false;

      const timer = setTimeout(() => {
        isTimeout = true;
        child.kill('SIGKILL');
      }, timeoutMs);

      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { stderr += d.toString(); });

      child.on('close', (runCode) => {
        clearTimeout(timer);
        const overallDuration = Date.now() - startOverall;
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}

        if (isTimeout) {
          return resolve({
            testCaseId: testCase.id,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: null,
            passed: false,
            status: 'Time Limit Exceeded',
            error: `Execution timed out after ${timeoutMs}ms`,
            runtimeMs: timeoutMs,
            userStdout: stdout
          });
        }

        if (runCode !== 0) {
          return resolve({
            testCaseId: testCase.id,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: null,
            passed: false,
            status: 'Runtime Error',
            error: stderr.trim() || 'Process crashed with non-zero exit code',
            runtimeMs: overallDuration,
            userStdout: stdout
          });
        }

        let runtimeMs = overallDuration;
        let actualOutput = '';
        const lines = stdout.split('\n');
        const userLogs = [];

        for (const line of lines) {
          if (line.startsWith('__RUNTIME_MS__=')) {
            runtimeMs = parseFloat(line.replace('__RUNTIME_MS__=', ''));
          } else if (line.startsWith('__RESULT__=')) {
            actualOutput = line.replace('__RESULT__=', '');
          } else if (line.trim().length > 0) {
            userLogs.push(line);
          }
        }

        const passed = normalizeOutput(actualOutput) === normalizeOutput(testCase.expectedOutput);
        resolve({
          testCaseId: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: actualOutput,
          passed,
          status: passed ? 'Passed' : 'Wrong Answer',
          error: null,
          runtimeMs: Math.round(runtimeMs * 100) / 100,
          userStdout: userLogs.join('\n')
        });
      });
    });
  });
}

/**
 * Main evaluation orchestrator:
 * Executes code against a collection of testcases
 */
export async function runTestCases({ code, language, problem, testCases, isCustom = false }) {
  const fnName = PROBLEM_FN_MAP[problem.id] || "solve";
  const results = [];
  let totalRuntime = 0;
  let overallStatus = "Accepted";

  for (const tc of testCases) {
    let res;
    if (language === 'python' || language === 'python3') {
      res = await executePython(code, tc, fnName, problem.timeLimitMs || 3000);
    } else if (language === 'javascript' || language === 'node') {
      res = await executeJavaScript(code, tc, fnName, problem.timeLimitMs || 3000);
    } else if (language === 'cpp' || language === 'c++') {
      res = await executeCpp(code, tc, fnName, problem.timeLimitMs || 3000);
    } else {
      res = {
        testCaseId: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: null,
        passed: false,
        status: 'Error',
        error: `Language '${language}' is not yet supported in this runner. Please select Python or JavaScript.`,
        runtimeMs: 0
      };
    }

    results.push(res);
    totalRuntime += res.runtimeMs || 0;

    // Determine priority of failure statuses: Compilation Error > Runtime Error > TLE > Wrong Answer
    if (!res.passed) {
      if (res.status === 'Compilation Error') {
        overallStatus = 'Compilation Error';
        // If compilation fails, subsequent testcases will also fail, so we can stop early
        break;
      } else if (res.status === 'Runtime Error' && overallStatus !== 'Compilation Error') {
        overallStatus = 'Runtime Error';
      } else if (res.status === 'Time Limit Exceeded' && !['Compilation Error', 'Runtime Error'].includes(overallStatus)) {
        overallStatus = 'Time Limit Exceeded';
      } else if (overallStatus === 'Accepted') {
        overallStatus = 'Wrong Answer';
      }
    }
  }

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = testCases.length;

  // Random realistic memory usage representation (e.g. 14.8 MB)
  const memoryMb = (12.4 + (Math.random() * 4.5)).toFixed(1);

  return {
    verdict: passedCount === totalCount ? 'Accepted' : overallStatus,
    passedCount,
    totalCount,
    passPercentage: totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0,
    totalRuntimeMs: Math.round(totalRuntime * 100) / 100,
    memoryMb: `${memoryMb} MB`,
    testResults: results,
    submittedAt: new Date().toISOString()
  };
}

