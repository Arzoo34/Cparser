// Simple code complexity analyzer
// This is a basic heuristic-based analyzer - for production, use a proper AST parser

export const analyzeComplexity = (code, language) => {
  if (!code) return { complexity: 'O(1)', level: 1 };

  const codeLower = code.toLowerCase();
  let maxNestedLoops = 0;
  let hasNestedLoop = false;
  let hasRecursion = false;
  let hasNestedRecursion = false;
  let loopCount = 0;
  let nestedLevel = 0;

  // Detect loops and nesting
  const loopPatterns = {
    javascript: ['for', 'while', 'foreach', 'map', 'filter', 'reduce', 'forEach'],
    typescript: ['for', 'while', 'foreach', 'map', 'filter', 'reduce', 'forEach'],
    python: ['for', 'while', 'in range', 'in '],
    java: ['for', 'while', 'foreach', 'enhanced for'],
    c: ['for', 'while'],
    cpp: ['for', 'while'],
    csharp: ['for', 'while', 'foreach'],
    php: ['for', 'while', 'foreach'],
  };

  const recursionPatterns = {
    javascript: ['function.*\\(.*\\)\\s*\\{', '=>.*=>'],
    python: ['def.*\\(.*\\):'],
    java: ['public.*\\(.*\\)\\s*\\{', 'private.*\\(.*\\)\\s*\\{'],
    c: ['\\w+\\s+\\w+\\s*\\(.*\\)\\s*\\{'],
    cpp: ['\\w+\\s+\\w+\\s*\\(.*\\)\\s*\\{', 'void\\s+\\w+\\s*\\(.*\\)\\s*\\{'],
  };

  const patterns = loopPatterns[language] || loopPatterns.javascript;

  // Count loops and check nesting
  const lines = code.split('\n');
  let inLoop = false;
  let loopDepth = 0;

  lines.forEach(line => {
    const lineLower = line.toLowerCase();

    // Check for loop start
    const startsLoop = patterns.some(pattern =>
      lineLower.includes(pattern) && !lineLower.includes('//') && !lineLower.includes('*')
    );

    // Check for opening brace/bracket
    const opensBlock = (line.match(/\{/g) || []).length;
    const closesBlock = (line.match(/\}/g) || []).length;

    if (startsLoop) {
      loopCount++;
      loopDepth++;
      maxNestedLoops = Math.max(maxNestedLoops, loopDepth);
      inLoop = true;
    }

    if (opensBlock > closesBlock && inLoop) {
      nestedLevel++;
    }

    if (closesBlock > opensBlock && inLoop) {
      loopDepth = Math.max(0, loopDepth - 1);
      if (loopDepth === 0) {
        inLoop = false;
      }
    }
  });

  hasNestedLoop = maxNestedLoops > 1;

  // Check for recursion (simple pattern matching)
  const recPatterns = recursionPatterns[language] || recursionPatterns.javascript;
  hasRecursion = recPatterns.some(pattern => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(code);
  });

  // Determine complexity based on heuristics
  if (loopCount === 0 && !hasRecursion) {
    return { complexity: 'O(1)', level: 1, description: 'Constant Time' };
  }

  if (hasNestedRecursion || (hasRecursion && hasNestedLoop)) {
    return { complexity: 'O(2^n)', level: 6, description: 'Exponential Time' };
  }

  if (hasNestedLoop && loopCount >= 2) {
    if (loopCount >= 3) {
      return { complexity: 'O(n³)', level: 5, description: 'Cubic Time' };
    }
    return { complexity: 'O(n²)', level: 4, description: 'Quadratic Time' };
  }

  if (hasRecursion) {
    // Check if it's binary search pattern (log n)
    if (codeLower.includes('mid') && codeLower.includes('left') && codeLower.includes('right')) {
      return { complexity: 'O(log n)', level: 2, description: 'Logarithmic Time' };
    }
    return { complexity: 'O(n)', level: 3, description: 'Linear Time' };
  }

  if (loopCount === 1) {
    // Check for binary search or divide and conquer
    if (codeLower.includes('mid') || codeLower.includes('divide') || codeLower.includes('split')) {
      return { complexity: 'O(log n)', level: 2, description: 'Logarithmic Time' };
    }
    return { complexity: 'O(n)', level: 3, description: 'Linear Time' };
  }

  if (loopCount === 2 && !hasNestedLoop) {
    return { complexity: 'O(n log n)', level: 3.5, description: 'Linearithmic Time' };
  }

  return { complexity: 'O(n)', level: 3, description: 'Linear Time' };
};

export const generateComplexityData = (detectedComplexity) => {
  const elements = Array.from({ length: 101 }, (_, i) => i);

  const complexities = {
    'O(1)': (n) => 1,
    'O(log n)': (n) => n > 0 ? Math.log2(n) * 10 : 0,
    'O(n)': (n) => n,
    'O(n log n)': (n) => n > 0 ? n * Math.log2(n) / 10 : 0,
    'O(n²)': (n) => n * n / 10,
    'O(n³)': (n) => n * n * n / 100,
    'O(2^n)': (n) => n < 15 ? Math.pow(2, n) / 10 : 1000,
  };

  const allComplexities = [
    { name: 'O(1)', color: '#00ff00', data: elements.map(n => ({ x: n, y: complexities['O(1)'](n) })) },
    { name: 'O(log n)', color: '#ff8800', data: elements.map(n => ({ x: n, y: complexities['O(log n)'](n) })) },
    { name: 'O(n)', color: '#88ff00', data: elements.map(n => ({ x: n, y: complexities['O(n)'](n) })) },
    { name: 'O(n log n)', color: '#ffffff', data: elements.map(n => ({ x: n, y: complexities['O(n log n)'](n) })) },
    { name: 'O(n²)', color: '#00aa88', data: elements.map(n => ({ x: n, y: complexities['O(n²)'](n) })) },
    { name: 'O(2^n)', color: '#00aaff', data: elements.map(n => ({ x: n, y: complexities['O(2^n)'](n) })) },
    { name: 'O(n!)', color: '#aa5500', data: elements.map(n => ({ x: n, y: n < 6 ? (n === 0 ? 1 : Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1) / 10) : 1000 })) },
  ];

  return allComplexities;
};


