// Comprehensive DSA Problem Modules & Categorized Questions
// Sourced directly from /home/dinesh/Desktop/DSA/problems

export const modules = [
  { id: "arrays", name: "Arrays", shortName: "Arrays", count: 2 },
  { id: "linked_lists", name: "Linked Lists", shortName: "Linked Lists", count: 1 },
  { id: "binary_search", name: "Binary Search", shortName: "Binary Search", count: 1 },
  { id: "strings", name: "Strings", shortName: "Strings", count: 1 },
  { id: "bit_manipulation", name: "Bit Manipulation", shortName: "Bit Manipulation", count: 1 },
  { id: "stacks_and_queues", name: "Stacks & Queues", shortName: "Stacks & Queues", count: 1 },
  { id: "trees", name: "Trees & BST", shortName: "Trees", count: 1 },
  { id: "recursion", name: "Recursion & Backtracking", shortName: "Recursion", count: 1 },
  { id: "sorting", name: "Sorting", shortName: "Sorting", count: 1 },
  { id: "two_pointers", name: "Two Pointers", shortName: "Two Pointers", count: 1 },
  { id: "hashing", name: "Hashing", shortName: "Hashing", count: 1 },
  { id: "graphs", name: "Graphs", shortName: "Graphs", count: 1 },
  { id: "dynamic_programming", name: "Dynamic Programming", shortName: "DP", count: 1 }
];

export const problems = [
  // 1. ARRAYS
  {
    id: "10",
    moduleId: "arrays",
    category: "Arrays",
    title: "Reverse the Array",
    difficulty: "Easy",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Arrays", "Basic"],
    author: "AlgoForge",
    description: `You are given a constant array \`A\`.

You are required to return another array which is the reversed form of the input array.`,
    constraints: `* 1 <= A.size() <= 10000
* 1 <= A[i] <= 10000`,
    inputFormat: `First argument is a constant array A.`,
    outputFormat: `Return an integer array.`,
    examples: [
      {
        input: "A = [1, 2, 3, 2, 1]",
        output: "[1, 2, 3, 2, 1]",
        explanation: "Reversed form of input array is same as original array."
      },
      {
        input: "A = [1, 1, 10]",
        output: "[10, 1, 1]",
        explanation: "Clearly, reverse of [1, 1, 10] is [10, 1, 1]."
      }
    ],
    sampleTestCases: [
      { id: 1, input: "[1, 2, 3, 2, 1]", expectedOutput: "[1, 2, 3, 2, 1]" },
      { id: 2, input: "[1, 1, 10]", expectedOutput: "[10, 1, 1]" }
    ],
    hiddenTestCases: [
      { id: 3, input: "[5]", expectedOutput: "[5]" },
      { id: 4, input: "[1, 2, 3, 4, 5, 6]", expectedOutput: "[6, 5, 4, 3, 2, 1]" },
      { id: 5, input: "[10, 20, 30]", expectedOutput: "[30, 20, 10]" },
      { id: 6, input: "[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]", expectedOutput: "[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]" }
    ],
    starterCodes: {
      python: `class Solution:
    # @param A : list of integers
    # @return a list of integers
    def solve(self, A):
        # Write your code here
        return A[::-1]
`,
      javascript: `module.exports = {
    //param A : array of integers
    //return an array of integers
    solve: function(A) {
        // Write your code here
        return A.slice().reverse();
    }
};`
    },
    hints: [
      "Hint 1: Can you swap elements starting from opposite ends?",
      "Hint 2: Loop from i = 0 to n/2 and swap A[i] with A[n - 1 - i]."
    ],
    editorial: `### Reversing an Array
We can create a new array or reverse in place using two pointers starting from 0 and n - 1.
Time Complexity: O(N)
Space Complexity: O(N) or O(1)`
  },
  {
    id: "4705",
    moduleId: "arrays",
    category: "Arrays",
    title: "Rain Water Trapped",
    difficulty: "Hard",
    score: 150,
    timeLimitMs: 2000,
    tags: ["Arrays", "Two Pointers", "Prefix Sum"],
    author: "AlgoForge",
    description: `Given a vector \`A\` of non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it is able to trap after raining.`,
    constraints: `* 1 <= |A| <= 10^5
* 0 <= A[i] <= 10^5`,
    inputFormat: `The only argument given is integer array A.`,
    outputFormat: `Return the total units of rainwater trapped.`,
    examples: [
      {
        input: "A = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]",
        output: "6",
        explanation: "6 units of rainwater are trapped between elevation bars."
      },
      {
        input: "A = [1, 2]",
        output: "0",
        explanation: "No water can be trapped as there are only 2 bars with no dip in between."
      }
    ],
    sampleTestCases: [
      { id: 1, input: "[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]", expectedOutput: "6" },
      { id: 2, input: "[1, 2]", expectedOutput: "0" }
    ],
    hiddenTestCases: [
      { id: 3, input: "[4, 2, 0, 3, 2, 5]", expectedOutput: "9" },
      { id: 4, input: "[3, 0, 2, 0, 4]", expectedOutput: "7" },
      { id: 5, input: "[5, 4, 1, 2]", expectedOutput: "1" },
      { id: 6, input: "[0, 0, 0, 0]", expectedOutput: "0" },
      { id: 7, input: "[5, 5, 5, 5]", expectedOutput: "0" },
      { id: 8, input: "[10, 0, 0, 10]", expectedOutput: "20" },
      { id: 9, input: "[2, 0, 2]", expectedOutput: "2" },
      { id: 10, input: "[0, 1, 2, 3, 4, 5]", expectedOutput: "0" },
      { id: 11, input: "[5, 4, 3, 2, 1, 0]", expectedOutput: "0" },
      { id: 12, input: "[6, 4, 2, 0, 3, 2, 0, 3, 1, 4, 5, 3, 2, 7, 5, 3, 0, 1, 2, 1, 3, 0, 1]", expectedOutput: "52" }
    ],
    starterCodes: {
      python: `class Solution:
    # @param A : list of integers
    # @return an integer
    def trap(self, A):
        # Write your code here
        pass
`,
      javascript: `module.exports = {
    //param A : array of integers
    //return an integer
    trap: function(A) {
        // Write your code here
        return 0;
    }
};`
    },
    hints: [
      "Hint 1: Water height at index i is min(max_left, max_right) - A[i].",
      "Hint 2: Maintain left and right pointers to compute this in O(1) space."
    ],
    editorial: `### Two Pointers Approach
Maintain left, right, left_max, right_max. Move the smaller side inward.
Time Complexity: O(N)
Space Complexity: O(1)`
  },

  // 2. LINKED LISTS
  {
    id: "315",
    moduleId: "linked_lists",
    category: "Linked Lists",
    title: "Palindrome List",
    difficulty: "Medium",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Linked Lists", "Two Pointers"],
    author: "AlgoForge",
    description: `Given a singly linked list \`A\`, determine if it's a palindrome. Return 1 or 0, denoting if it's a palindrome or not, respectively.`,
    constraints: `* 1 <= |A| <= 10^5`,
    inputFormat: `The first and only argument contains a list or pointer to the head of the given linked list.`,
    outputFormat: `Return 0 if the linked list is not a palindrome, 1 if it is a palindrome.`,
    examples: [
      {
        input: "A = [1, 2, 2, 1]",
        output: "1",
        explanation: "The first linked list is a palindrome as [1, 2, 2, 1] is equal to its reversed form."
      },
      {
        input: "A = [1, 3, 2]",
        output: "0",
        explanation: "The second linked list is not a palindrome as [1, 3, 2] is not equal to [2, 3, 1]."
      }
    ],
    sampleTestCases: [
      { id: 1, input: "[1, 2, 2, 1]", expectedOutput: "1" },
      { id: 2, input: "[1, 3, 2]", expectedOutput: "0" }
    ],
    hiddenTestCases: [
      { id: 3, input: "[1]", expectedOutput: "1" },
      { id: 4, input: "[1, 2, 3, 2, 1]", expectedOutput: "1" },
      { id: 5, input: "[1, 2, 3, 4, 5]", expectedOutput: "0" },
      { id: 6, input: "[2, 2, 2, 2, 2]", expectedOutput: "1" },
      { id: 7, input: "[1, 2, 3, 3, 2, 1]", expectedOutput: "1" }
    ],
    starterCodes: {
      python: `class Solution:
    # @param A : list of integers
    # @return an integer (1 or 0)
    def solve(self, A):
        # Write your code here
        return 1 if A == A[::-1] else 0
`,
      javascript: `module.exports = {
    //param A : array of integers
    //return an integer
    solve: function(A) {
        for (let i = 0; i < Math.floor(A.length / 2); i++) {
            if (A[i] !== A[A.length - 1 - i]) return 0;
        }
        return 1;
    }
};`
    },
    hints: [
      "Hint 1: Find the middle node using slow and fast pointers.",
      "Hint 2: Reverse the second half of the linked list and compare with the first half."
    ],
    editorial: `### Middle & Reverse Method
1. Find middle with slow and fast pointers.
2. Reverse the second half.
3. Compare both halves element by element.
Time: O(N), Space: O(1)`
  },

  // 3. BINARY SEARCH
  {
    id: "249",
    moduleId: "binary_search",
    category: "Binary Search",
    title: "Sorted Insert Position",
    difficulty: "Easy",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Binary Search", "Arrays"],
    author: "AlgoForge",
    description: `You are given a sorted array \`A\` of size \`N\` and a target value \`B\`.
Your task is to find the index (0-based indexing) of the target value in the array.

* If the target value is present, return its index.
* If the target value is not found, return the index of least element greater than equal to B.
* If the target value is not found and least number greater than equal to target is also not present, return the length of array (i.e. the position where target can be placed).
* Your solution should have a time complexity of \`O(log(N))\`.`,
    constraints: `* 1 <= N <= 10^5
* 1 <= A[i] <= 10^5
* 1 <= B <= 10^5`,
    inputFormat: `The first argument is an integer array A of size N.
The second argument is an integer B.`,
    outputFormat: `Return an integer denoting the index of target value.`,
    examples: [
      {
        input: "A = [1, 3, 5, 6], B = 5",
        output: "2",
        explanation: "The target value is present at index 2."
      },
      {
        input: "A = [1, 4, 9], B = 3",
        output: "1",
        explanation: "The target value should be inserted at index 1."
      }
    ],
    sampleTestCases: [
      { id: 1, input: "[1, 3, 5, 6], 5", expectedOutput: "2" },
      { id: 2, input: "[1, 4, 9], 3", expectedOutput: "1" }
    ],
    hiddenTestCases: [
      { id: 3, input: "[1, 3, 5, 6], 7", expectedOutput: "4" },
      { id: 4, input: "[1, 3, 5, 6], 0", expectedOutput: "0" },
      { id: 5, input: "[1, 2, 4, 6, 8, 10], 5", expectedOutput: "3" },
      { id: 6, input: "[10, 20, 30, 40, 50], 30", expectedOutput: "2" }
    ],
    starterCodes: {
      python: `class Solution:
    # @param A : list of integers
    # @param B : integer
    # @return an integer
    def searchInsert(self, A, B):
        # Write your code here
        pass
`,
      javascript: `module.exports = {
    //param A : array of integers
    //param B : integer
    //return an integer
    searchInsert: function(A, B) {
        // Write your code here
        return 0;
    }
};`
    },
    hints: [
      "Hint 1: Use binary search with left = 0, right = len(A) - 1.",
      "Hint 2: When the loop terminates, left points to the insert position."
    ],
    editorial: `### Standard Binary Search
Initialize low = 0, high = n - 1. While low <= high, if A[mid] >= B, answer = mid, high = mid - 1; else low = mid + 1.
Time Complexity: O(log N)
Space Complexity: O(1)`
  },

  // 4. STRINGS
  {
    id: "104",
    moduleId: "strings",
    category: "Strings",
    title: "Reverse the String",
    difficulty: "Medium",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Strings"],
    author: "AlgoForge",
    description: `You are given a string \`A\` of size \`N\`.

Return the string \`A\` after reversing the string word by word.

**NOTE:**
* A sequence of non-space characters constitutes a word.
* Your reversed string should not contain leading or trailing spaces, even if it is present in the input string.
* If there are multiple spaces between words, reduce them to a single space in the reversed string.`,
    constraints: `* 1 <= N <= 3 * 10^5`,
    inputFormat: `The only argument given is string A.`,
    outputFormat: `Return the string A after reversing the string word by word.`,
    examples: [
      {
        input: 'A = "the sky is blue"',
        output: '"blue is sky the"',
        explanation: 'We reverse the string word by word so the string becomes "blue is sky the".'
      },
      {
        input: 'A = "this is ib"',
        output: '"ib is this"',
        explanation: 'We reverse the string word by word so the string becomes "ib is this".'
      }
    ],
    sampleTestCases: [
      { id: 1, input: '"the sky is blue"', expectedOutput: '"blue is sky the"' },
      { id: 2, input: '"this is ib"', expectedOutput: '"ib is this"' }
    ],
    hiddenTestCases: [
      { id: 3, input: '"  hello   world  "', expectedOutput: '"world hello"' },
      { id: 4, input: '"scaler academy coding"', expectedOutput: '"coding academy scaler"' },
      { id: 5, input: '"antigravity agent"', expectedOutput: '"agent antigravity"' },
      { id: 6, input: '"one"', expectedOutput: '"one"' }
    ],
    starterCodes: {
      python: `class Solution:
    # @param A : string
    # @return a string
    def solve(self, A):
        # Write your code here
        return " ".join(A.strip().split()[::-1])
`,
      javascript: `module.exports = {
    //param A : string
    //return a string
    solve: function(A) {
        return A.trim().split(/\\s+/).reverse().join(" ");
    }
};`
    },
    hints: [
      "Hint 1: Split the string by whitespace into words.",
      "Hint 2: Reverse the array of words and join with a single space."
    ],
    editorial: `### Tokenize & Reverse
Trim whitespace, split into tokens, reverse the token list, and join with a space.
Time Complexity: O(N)
Space Complexity: O(N)`
  },

  // 5. BIT MANIPULATION
  {
    id: "75",
    moduleId: "bit_manipulation",
    category: "Bit Manipulation",
    title: "Single Number",
    difficulty: "Easy",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Bit Manipulation"],
    author: "AlgoForge",
    description: `Given an array of integers \`A\`, every element appears twice except for one. Find that integer that occurs once.

**NOTE:** Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?`,
    constraints: `* 1 <= |A| <= 2000000
* 0 <= A[i] <= 10^9`,
    inputFormat: `The first and only argument of input contains an integer array A.`,
    outputFormat: `Return a single integer denoting the single element.`,
    examples: [
      {
        input: "A = [1, 2, 2, 3, 1]",
        output: "3",
        explanation: "3 occurs once, while 1 and 2 occur twice."
      },
      {
        input: "A = [1, 2, 2]",
        output: "1",
        explanation: "1 occurs once, while 2 occurs twice."
      }
    ],
    sampleTestCases: [
      { id: 1, input: "[1, 2, 2, 3, 1]", expectedOutput: "3" },
      { id: 2, input: "[1, 2, 2]", expectedOutput: "1" }
    ],
    hiddenTestCases: [
      { id: 3, input: "[0]", expectedOutput: "0" },
      { id: 4, input: "[17, 12, 17, 89, 12]", expectedOutput: "89" },
      { id: 5, input: "[4, 1, 2, 1, 2]", expectedOutput: "4" },
      { id: 6, input: "[100, 200, 300, 200, 100]", expectedOutput: "300" }
    ],
    starterCodes: {
      python: `class Solution:
    # @param A : tuple of integers
    # @return an integer
    def singleNumber(self, A):
        # Write your code here
        ans = 0
        for x in A:
            ans ^= x
        return ans
`,
      javascript: `module.exports = {
    //param A : array of integers
    //return an integer
    singleNumber: function(A) {
        let ans = 0;
        for (let x of A) ans ^= x;
        return ans;
    }
};`
    },
    hints: [
      "Hint 1: Recall the properties of XOR: X ^ X = 0 and X ^ 0 = X.",
      "Hint 2: XORing all elements together cancels out all pairs, leaving only the single number!"
    ],
    editorial: `### XOR Properties
XOR of any number with itself is 0, and XOR of any number with 0 is the number itself.
Since all elements except one appear twice, their XOR is 0.
0 ^ unique = unique.
Time Complexity: O(N)
Space Complexity: O(1)`
  },

  // 6. STACKS & QUEUES
  {
    id: "321",
    moduleId: "stacks_and_queues",
    category: "Stacks & Queues",
    title: "Balanced Parenthesis",
    difficulty: "Easy",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Stacks", "Strings"],
    author: "AlgoForge",
    description: `Given an expression string \`A\`, examine whether the pairs and the orders of "{", "}", "(", ")", "[", "]" are correct in \`A\`.

Refer to the examples for more clarity. Return 1 if balanced, else 0.`,
    constraints: `* 1 <= |A| <= 10^5`,
    inputFormat: `The first and only argument of input contains the string A having the parenthesis sequence.`,
    outputFormat: `Return 0 if the parenthesis sequence is not balanced, 1 if it is balanced.`,
    examples: [
      {
        input: 'A = "{([])}"',
        output: "1",
        explanation: "{([])} is a valid balanced parenthesis sequence."
      },
      {
        input: 'A = "(){"',
        output: "0",
        explanation: "(){ is not balanced because the open bracket { is never closed."
      }
    ],
    sampleTestCases: [
      { id: 1, input: '"{([])}"', expectedOutput: "1" },
      { id: 2, input: '"(){"', expectedOutput: "0" }
    ],
    hiddenTestCases: [
      { id: 3, input: '"()[]{}"', expectedOutput: "1" },
      { id: 4, input: '"(]"', expectedOutput: "0" },
      { id: 5, input: '"([)]"', expectedOutput: "0" },
      { id: 6, input: '"{[]}"', expectedOutput: "1" },
      { id: 7, input: '""', expectedOutput: "1" }
    ],
    starterCodes: {
      python: `class Solution:
    # @param A : string
    # @return an integer (1 or 0)
    def solve(self, A):
        stack = []
        pairs = {')': '(', ']': '[', '}': '{'}
        for ch in A:
            if ch in '([{':
                stack.append(ch)
            elif ch in ')]}':
                if not stack or stack[-1] != pairs[ch]:
                    return 0
                stack.pop()
        return 1 if not stack else 0
`,
      javascript: `module.exports = {
    //param A : string
    //return an integer
    solve: function(A) {
        const stack = [];
        const pairs = { ')': '(', ']': '[', '}': '{' };
        for (let ch of A) {
            if (ch === '(' || ch === '[' || ch === '{') {
                stack.push(ch);
            } else if (ch === ')' || ch === ']' || ch === '}') {
                if (stack.length === 0 || stack[stack.length - 1] !== pairs[ch]) {
                    return 0;
                }
                stack.pop();
            }
        }
        return stack.length === 0 ? 1 : 0;
    }
};`
    },
    hints: [
      "Hint 1: Push opening brackets onto a stack.",
      "Hint 2: When encountering a closing bracket, verify that the top of the stack has the matching opening bracket."
    ],
    editorial: `### Stack for Balanced Parenthesis
Push opening brackets into a stack. For each closing bracket, check if stack is empty or doesn't match top. At the end, stack must be empty.
Time Complexity: O(N)
Space Complexity: O(N)`
  },

  // 7. TREES
  {
    id: "166",
    moduleId: "trees",
    category: "Trees & BST",
    title: "Tree Height / Depth",
    difficulty: "Easy",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Trees", "Recursion", "DFS"],
    author: "AlgoForge",
    description: `You are given a binary tree represented as an array or node list \`A\`. You have to find the height of the given tree.

A binary tree's height is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    constraints: `* 1 <= Number of nodes in the tree <= 10^5`,
    inputFormat: `The first and only argument is a tree array A.`,
    outputFormat: `Return an integer denoting the height of the tree.`,
    examples: [
      {
        input: "A = [1, 2, 3, 4, 5]",
        output: "3",
        explanation: "Tree with root 1 has children 2 and 3, and 2 has children 4 and 5. Longest path 1 -> 2 -> 4 has 3 nodes."
      },
      {
        input: "A = [1, 2, 3]",
        output: "2",
        explanation: "Height is 2."
      }
    ],
    sampleTestCases: [
      { id: 1, input: "[1, 2, 3, 4, 5]", expectedOutput: "3" },
      { id: 2, input: "[1, 2, 3]", expectedOutput: "2" }
    ],
    hiddenTestCases: [
      { id: 3, input: "[1]", expectedOutput: "1" },
      { id: 4, input: "[1, 2, 3, 4, 5, 6, 7]", expectedOutput: "3" },
      { id: 5, input: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]", expectedOutput: "4" }
    ],
    starterCodes: {
      python: `import math

class Solution:
    # @param A : list of integers
    # @return an integer
    def solve(self, A):
        if not A:
            return 0
        return math.floor(math.log2(len(A))) + 1
`,
      javascript: `module.exports = {
    //param A : array of integers
    //return an integer
    solve: function(A) {
        if (!A || A.length === 0) return 0;
        return Math.floor(Math.log2(A.length)) + 1;
    }
};`
    },
    hints: [
      "Hint 1: In a binary tree, height = 1 + max(height(left), height(right)).",
      "Hint 2: For full/complete tree array representation, height = floor(log2(N)) + 1."
    ],
    editorial: `### Tree Height
Calculate maximum depth recursively: 1 + max(depth(left), depth(right)).
Time Complexity: O(N)
Space Complexity: O(H)`
  },

  // 8. RECURSION & BACKTRACKING
  {
    id: "131",
    moduleId: "recursion",
    category: "Recursion & Backtracking",
    title: "Find Factorial!",
    difficulty: "Easy",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Recursion", "Math"],
    author: "AlgoForge",
    description: `Write a program to find the factorial of the given number \`A\` using recursion.

**Note:** The factorial of a number N is defined as the product of the numbers from 1 to N. Factorial of 0 is 1.`,
    constraints: `* 0 <= A <= 12`,
    inputFormat: `First and only argument is an integer A.`,
    outputFormat: `Return an integer denoting the factorial of the number A.`,
    examples: [
      {
        input: "A = 4",
        output: "24",
        explanation: "4! = 4 * 3 * 2 * 1 = 24."
      },
      {
        input: "A = 1",
        output: "1",
        explanation: "1! = 1."
      }
    ],
    sampleTestCases: [
      { id: 1, input: "4", expectedOutput: "24" },
      { id: 2, input: "1", expectedOutput: "1" }
    ],
    hiddenTestCases: [
      { id: 3, input: "0", expectedOutput: "1" },
      { id: 4, input: "5", expectedOutput: "120" },
      { id: 5, input: "6", expectedOutput: "720" },
      { id: 6, input: "10", expectedOutput: "3628800" }
    ],
    starterCodes: {
      python: `class Solution:
    # @param A : integer
    # @return an integer
    def solve(self, A):
        # Write your code here (using recursion)
        if A <= 1:
            return 1
        return A * self.solve(A - 1)
`,
      javascript: `module.exports = {
    //param A : integer
    //return an integer
    solve: function(A) {
        if (A <= 1) return 1;
        return A * this.solve(A - 1);
    }
};`
    },
    hints: [
      "Hint 1: Base case: if A <= 1, return 1.",
      "Hint 2: Recursive step: return A * solve(A - 1)."
    ],
    editorial: `### Recursive Factorial
Base case: A <= 1 returns 1.
Recursive case: A * factorial(A - 1).
Time: O(A), Space: O(A) recursion stack.`
  },

  // 9. SORTING
  {
    id: "231",
    moduleId: "sorting",
    category: "Sorting",
    title: "Merge Two Sorted Arrays",
    difficulty: "Medium",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Sorting", "Two Pointers"],
    author: "AlgoForge",
    description: `Given two sorted integer arrays \`A\` and \`B\`, merge \`B\` and \`A\` as one sorted array and return it as an output.

**Note:** A linear time complexity is expected and you should avoid use of any library function.`,
    constraints: `* -2 * 10^9 <= A[i], B[i] <= 2 * 10^9
* 1 <= |A|, |B| <= 5 * 10^4`,
    inputFormat: `First Argument is a 1-D array representing A.
Second Argument is also a 1-D array representing B.`,
    outputFormat: `Return a 1-D array representing the merged sorted array.`,
    examples: [
      {
        input: "A = [4, 7, 9], B = [2, 11, 19]",
        output: "[2, 4, 7, 9, 11, 19]",
        explanation: "Merged sorted list of [4, 7, 9] and [2, 11, 19] is [2, 4, 7, 9, 11, 19]."
      },
      {
        input: "A = [1], B = [2]",
        output: "[1, 2]",
        explanation: "Merged array is [1, 2]."
      }
    ],
    sampleTestCases: [
      { id: 1, input: "[4, 7, 9], [2, 11, 19]", expectedOutput: "[2, 4, 7, 9, 11, 19]" },
      { id: 2, input: "[1], [2]", expectedOutput: "[1, 2]" }
    ],
    hiddenTestCases: [
      { id: 3, input: "[1, 3, 5], [2, 4, 6]", expectedOutput: "[1, 2, 3, 4, 5, 6]" },
      { id: 4, input: "[10, 20], [5, 15, 25, 30]", expectedOutput: "[5, 10, 15, 20, 25, 30]" },
      { id: 5, input: "[-5, -1], [-3, 0, 2]", expectedOutput: "[-5, -3, -1, 0, 2]" }
    ],
    starterCodes: {
      python: `class Solution:
    # @param A : tuple of integers
    # @param B : tuple of integers
    # @return a list of integers
    def solve(self, A, B):
        i, j = 0, 0
        res = []
        while i < len(A) and j < len(B):
            if A[i] <= B[j]:
                res.append(A[i])
                i += 1
            else:
                res.append(B[j])
                j += 1
        res.extend(A[i:])
        res.extend(B[j:])
        return res
`,
      javascript: `module.exports = {
    //param A : array of integers
    //param B : array of integers
    //return an array of integers
    solve: function(A, B) {
        let i = 0, j = 0;
        const res = [];
        while (i < A.length && j < B.length) {
            if (A[i] <= B[j]) {
                res.push(A[i++]);
            } else {
                res.push(B[j++]);
            }
        }
        while (i < A.length) res.push(A[i++]);
        while (j < B.length) res.push(B[j++]);
        return res;
    }
};`
    },
    hints: [
      "Hint 1: Maintain two pointers i and j pointing to the start of A and B.",
      "Hint 2: Append the smaller element and advance that pointer."
    ],
    editorial: `### Merge Two Sorted Arrays
Classic merge step of Merge Sort in O(|A| + |B|) time.
Time Complexity: O(N + M)
Space Complexity: O(N + M)`
  },

  // 10. TWO POINTERS
  {
    id: "268",
    moduleId: "two_pointers",
    category: "Two Pointers",
    title: "Container With Most Water",
    difficulty: "Medium",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Two Pointers", "Greedy"],
    author: "AlgoForge",
    description: `Given \`N\` non-negative integers \`A[0], A[1], ..., A[N-1]\`, where each represents a point at coordinate \`(i, A[i])\`.

N vertical lines are drawn such that the two endpoints of line i is at \`(i, A[i])\` and \`(i, 0)\`.

Find two lines, which together with x-axis forms a container, such that the container contains the most water. Return this maximum area.`,
    constraints: `* 1 <= N <= 10^5
* 1 <= A[i] <= 10^5`,
    inputFormat: `Single Argument representing a 1-D array A.`,
    outputFormat: `Return single Integer denoting the maximum area you can obtain.`,
    examples: [
      {
        input: "A = [1, 5, 4, 3]",
        output: "6",
        explanation: "5 and 3 are distance 2 apart. Height = min(5, 3) = 3. Area = 3 * 2 = 6."
      },
      {
        input: "A = [1]",
        output: "0",
        explanation: "No container can be formed."
      }
    ],
    sampleTestCases: [
      { id: 1, input: "[1, 5, 4, 3]", expectedOutput: "6" },
      { id: 2, input: "[1]", expectedOutput: "0" }
    ],
    hiddenTestCases: [
      { id: 3, input: "[1, 8, 6, 2, 5, 4, 8, 3, 7]", expectedOutput: "49" },
      { id: 4, input: "[4, 3, 2, 1, 4]", expectedOutput: "16" },
      { id: 5, input: "[1, 2, 1]", expectedOutput: "2" }
    ],
    starterCodes: {
      python: `class Solution:
    # @param A : list of integers
    # @return an integer
    def maxArea(self, A):
        l, r = 0, len(A) - 1
        res = 0
        while l < r:
            res = max(res, min(A[l], A[r]) * (r - l))
            if A[l] < A[r]:
                l += 1
            else:
                r -= 1
        return res
`,
      javascript: `module.exports = {
    //param A : array of integers
    //return an integer
    maxArea: function(A) {
        let l = 0, r = A.length - 1;
        let res = 0;
        while (l < r) {
            res = Math.max(res, Math.min(A[l], A[r]) * (r - l));
            if (A[l] < A[r]) l++;
            else r--;
        }
        return res;
    }
};`
    },
    hints: [
      "Hint 1: Start with the widest container: left = 0, right = n - 1.",
      "Hint 2: Moving the taller boundary inward can never increase area. So move the shorter boundary inward!"
    ],
    editorial: `### Two Pointers Greedy
At each step, calculate area = min(A[l], A[r]) * (r - l). Advance the smaller pointer.
Time Complexity: O(N)
Space Complexity: O(1)`
  },

  // 11. HASHING
  {
    id: "119",
    moduleId: "hashing",
    category: "Hashing",
    title: "First Repeating Element",
    difficulty: "Easy",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Hashing", "Arrays"],
    author: "AlgoForge",
    description: `Given an integer array \`A\` of size \`N\`, find the first repeating element in it.

We need to find the element that occurs more than once and whose index of the first occurrence is the smallest.
If there is no repeating element, return -1.`,
    constraints: `* 1 <= N <= 10^5
* 1 <= A[i] <= 10^9`,
    inputFormat: `The first and only argument is an integer array A of size N.`,
    outputFormat: `Return an integer denoting the first repeating element.`,
    examples: [
      {
        input: "A = [10, 5, 3, 4, 3, 5, 6]",
        output: "5",
        explanation: "5 is the first element that repeats."
      },
      {
        input: "A = [6, 10, 5, 4, 9, 120]",
        output: "-1",
        explanation: "There is no repeating element, output -1."
      }
    ],
    sampleTestCases: [
      { id: 1, input: "[10, 5, 3, 4, 3, 5, 6]", expectedOutput: "5" },
      { id: 2, input: "[6, 10, 5, 4, 9, 120]", expectedOutput: "-1" }
    ],
    hiddenTestCases: [
      { id: 3, input: "[1, 2, 3, 1]", expectedOutput: "1" },
      { id: 4, input: "[1, 2, 3, 4, 5, 6, 7, 8, 2]", expectedOutput: "2" },
      { id: 5, input: "[4, 4, 4, 4]", expectedOutput: "4" }
    ],
    starterCodes: {
      python: `class Solution:
    # @param A : list of integers
    # @return an integer
    def solve(self, A):
        freq = {}
        for x in A:
            freq[x] = freq.get(x, 0) + 1
        for x in A:
            if freq[x] > 1:
                return x
        return -1
`,
      javascript: `module.exports = {
    //param A : array of integers
    //return an integer
    solve: function(A) {
        const freq = new Map();
        for (let x of A) freq.set(x, (freq.get(x) || 0) + 1);
        for (let x of A) {
            if (freq.get(x) > 1) return x;
        }
        return -1;
    }
};`
    },
    hints: [
      "Hint 1: Store frequency of each element in a hash map.",
      "Hint 2: Iterate through the array once more and return the first element with frequency > 1."
    ],
    editorial: `### Hash Map Frequency Pass
Pass 1: Build frequency map.
Pass 2: Traverse array from left to right; return first element with count > 1.
Time Complexity: O(N)
Space Complexity: O(N)`
  },

  // 12. GRAPHS
  {
    id: "471",
    moduleId: "graphs",
    category: "Graphs",
    title: "Path in Directed Graph",
    difficulty: "Medium",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Graphs", "BFS", "DFS"],
    author: "AlgoForge",
    description: `Given a directed graph having \`A\` nodes labelled from 1 to A containing M edges given by matrix \`B\` of size M x 2 such that there is an edge directed from node \`B[i][0]\` to node \`B[i][1]\`.

Find whether a path exists from node 1 to node A. Return 1 if path exists else return 0.`,
    constraints: `* 2 <= A <= 10^5
* 1 <= M <= min(200000, A*(A-1))
* 1 <= B[i][0], B[i][1] <= A`,
    inputFormat: `The first argument is integer A (number of nodes).
The second argument is 2D array B of edges.`,
    outputFormat: `Return 1 if path exists between node 1 to node A else return 0.`,
    examples: [
      {
        input: "A = 5, B = [[1, 2], [4, 1], [2, 4], [3, 4], [5, 2], [1, 3]]",
        output: "0",
        explanation: "No path exists from node 1 to node 5."
      },
      {
        input: "A = 5, B = [[1, 2], [2, 3], [3, 4], [4, 5]]",
        output: "1",
        explanation: "Path exists: 1 -> 2 -> 3 -> 4 -> 5."
      }
    ],
    sampleTestCases: [
      { id: 1, input: "5, [[1, 2], [4, 1], [2, 4], [3, 4], [5, 2], [1, 3]]", expectedOutput: "0" },
      { id: 2, input: "5, [[1, 2], [2, 3], [3, 4], [4, 5]]", expectedOutput: "1" }
    ],
    hiddenTestCases: [
      { id: 3, input: "3, [[1, 2], [2, 3]]", expectedOutput: "1" },
      { id: 4, input: "4, [[1, 2], [2, 3], [1, 3]]", expectedOutput: "0" },
      { id: 5, input: "2, [[1, 2]]", expectedOutput: "1" }
    ],
    starterCodes: {
      python: `from collections import deque

class Solution:
    # @param A : integer
    # @param B : list of list of integers
    # @return an integer
    def solve(self, A, B):
        adj = {i: [] for i in range(1, A + 1)}
        for u, v in B:
            adj[u].append(v)
            
        q = deque([1])
        visited = {1}
        while q:
            curr = q.popleft()
            if curr == A:
                return 1
            for nxt in adj.get(curr, []):
                if nxt not in visited:
                    visited.add(nxt)
                    q.append(nxt)
        return 0
`,
      javascript: `module.exports = {
    //param A : integer
    //param B : array of array of integers
    //return an integer
    solve: function(A, B) {
        const adj = new Map();
        for (let i = 1; i <= A; i++) adj.set(i, []);
        for (let [u, v] of B) adj.get(u)?.push(v);

        const q = [1];
        const visited = new Set([1]);
        while (q.length > 0) {
            const curr = q.shift();
            if (curr === A) return 1;
            for (let nxt of (adj.get(curr) || [])) {
                if (!visited.has(nxt)) {
                    visited.add(nxt);
                    q.push(nxt);
                }
            }
        }
        return 0;
    }
};`
    },
    hints: [
      "Hint 1: Build an adjacency list representing directed edges.",
      "Hint 2: Start BFS/DFS traversal from node 1 and check if node A is reachable."
    ],
    editorial: `### BFS / DFS Reachability
Build directed adjacency list. Run BFS starting from 1. If target A is popped, return 1; if queue becomes empty, return 0.
Time Complexity: O(V + E)
Space Complexity: O(V + E)`
  },

  // 13. DYNAMIC PROGRAMMING
  {
    id: "427",
    moduleId: "dynamic_programming",
    category: "Dynamic Programming",
    title: "Stairs (Climbing Stairs)",
    difficulty: "Easy",
    score: 100,
    timeLimitMs: 2000,
    tags: ["Dynamic Programming", "Math"],
    author: "AlgoForge",
    description: `You are climbing a staircase and it takes \`A\` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?
Return the number of distinct ways modulo \`1000000007\`.`,
    constraints: `* 1 <= A <= 10^5`,
    inputFormat: `The first and only argument contains an integer A, the number of steps.`,
    outputFormat: `Return an integer representing the number of ways to reach the top.`,
    examples: [
      {
        input: "A = 2",
        output: "2",
        explanation: "Distinct ways to reach top: [1, 1], [2]."
      },
      {
        input: "A = 3",
        output: "3",
        explanation: "Distinct ways to reach top: [1, 1, 1], [1, 2], [2, 1]."
      }
    ],
    sampleTestCases: [
      { id: 1, input: "2", expectedOutput: "2" },
      { id: 2, input: "3", expectedOutput: "3" }
    ],
    hiddenTestCases: [
      { id: 3, input: "1", expectedOutput: "1" },
      { id: 4, input: "4", expectedOutput: "5" },
      { id: 5, input: "5", expectedOutput: "8" },
      { id: 6, input: "10", expectedOutput: "89" },
      { id: 7, input: "50", expectedOutput: "365010934" }
    ],
    starterCodes: {
      python: `class Solution:
    # @param A : integer
    # @return an integer
    def climbStairs(self, A):
        if A <= 2:
            return A
        MOD = 1000000007
        a, b = 1, 2
        for _ in range(3, A + 1):
            a, b = b, (a + b) % MOD
        return b
`,
      javascript: `module.exports = {
    //param A : integer
    //return an integer
    climbStairs: function(A) {
        if (A <= 2) return A;
        const MOD = 1000000007;
        let a = 1, b = 2;
        for (let i = 3; i <= A; i++) {
            let next = (a + b) % MOD;
            a = b;
            b = next;
        }
        return b;
    }
};`
    },
    hints: [
      "Hint 1: To reach step i, you could have come from step (i - 1) or step (i - 2).",
      "Hint 2: dp[i] = dp[i-1] + dp[i-2], which matches the Fibonacci sequence!"
    ],
    editorial: `### Fibonacci DP
Base cases: dp[1] = 1, dp[2] = 2.
Transition: dp[i] = (dp[i-1] + dp[i-2]) % 1000000007.
We can optimize space to O(1) by storing only the previous two states.
Time Complexity: O(A)
Space Complexity: O(1)`
  }
];
