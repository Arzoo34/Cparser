/**
 * Static complexity analyzer — loop nesting, recursion, and common algorithm patterns.
 */

const COMPLEXITY_META = {
  "O(1)": { level: 1, description: "Constant Time" },
  "O(log n)": { level: 2, description: "Logarithmic Time" },
  "O(n)": { level: 3, description: "Linear Time" },
  "O(n log n)": { level: 3.5, description: "Linearithmic Time" },
  "O(n²)": { level: 4, description: "Quadratic Time" },
  "O(n³)": { level: 5, description: "Cubic Time" },
  "O(2^n)": { level: 6, description: "Exponential Time" },
  "O(n!)": { level: 7, description: "Factorial Time" },
};

const stripComments = (code, language) => {
  if (language === "python") {
    return code
      .split("\n")
      .map((line) => line.replace(/#.*$/, ""))
      .join("\n");
  }
  let out = code.replace(/\/\*[\s\S]*?\*\//g, "");
  out = out.replace(/\/\/.*$/gm, "");
  return out;
};

const countLoops = (code, language) => {
  const patterns = {
    javascript: /\b(for|while|do)\b/g,
    python: /\b(for|while)\b/g,
    java: /\b(for|while|do)\b/g,
    c: /\b(for|while|do)\b/g,
    cpp: /\b(for|while|do)\b/g,
  };
  const re = patterns[language] || patterns.javascript;
  const matches = code.match(re) || [];
  return matches.length;
};

/** Estimate max loop nesting via brace/bracket depth at loop keywords. */
const measureLoopNesting = (code, language) => {
  const loopStart =
    language === "python"
      ? /^\s*(for|while)\b/
      : /\b(for|while|do)\b/;
  let depth = 0;
  let maxDepth = 0;
  let loopDepth = 0;

  const lines = code.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (loopStart.test(trimmed)) {
      loopDepth++;
      maxDepth = Math.max(maxDepth, loopDepth);
    }

    if (language === "python") {
      const indent = line.match(/^\s*/)[0].length;
      if (loopStart.test(trimmed)) depth = indent;
      else if (trimmed && indent <= depth && loopDepth > 0) loopDepth = Math.max(0, loopDepth - 1);
    } else {
      const opens = (line.match(/[{([]/g) || []).length;
      const closes = (line.match(/[})\]]/g) || []).length;
      depth += opens - closes;
      if (closes > opens && loopDepth > 0) loopDepth = Math.max(0, loopDepth - 1);
    }
  }

  return { maxDepth: Math.max(maxDepth, 1), loopCount: countLoops(code, language) };
};

const detectRecursion = (code, language) => {
  const fnNames = new Set();

  if (language === "python") {
    const defs = [...code.matchAll(/def\s+(\w+)\s*\(/g)];
    defs.forEach((m) => fnNames.add(m[1]));
  } else if (language === "java") {
    const defs = [...code.matchAll(/(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\(/g)];
    defs.forEach((m) => fnNames.add(m[1]));
  } else {
    const defs = [...code.matchAll(/(?:function\s+(\w+)|(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|(\w+)\s*\([^)]*\)\s*\{)/g)];
    defs.forEach((m) => {
      const name = m[1] || m[2] || m[3];
      if (name && !["if", "for", "while", "switch", "catch"].includes(name)) fnNames.add(name);
    });
  }

  for (const name of fnNames) {
    const callRe = new RegExp(`\\b${name}\\s*\\(`, "g");
    const defRe =
      language === "python"
        ? new RegExp(`def\\s+${name}\\s*\\(`)
        : new RegExp(`(?:function\\s+${name}|\\b${name}\\s*\\([^)]*\\)\\s*\\{)`);
    if (defRe.test(code) && (code.match(callRe) || []).length >= 2) {
      return { hasRecursion: true, functionName: name };
    }
  }
  return { hasRecursion: false };
};

const detectPatterns = (code) => {
  const lower = code.toLowerCase();
  return {
    binarySearch:
      (lower.includes("mid") || lower.includes("middle")) &&
      (lower.includes("left") || lower.includes("right") || lower.includes("lo") || lower.includes("hi")),
    divideConquer:
      /\b(mid|middle)\b/.test(lower) &&
      (/\/\s*2|>>\s*1|\*\s*0\.5/.test(code) || lower.includes("divide")),
    sorting:
      lower.includes("sort") ||
      lower.includes("quicksort") ||
      lower.includes("mergesort") ||
      lower.includes("bubble"),
    nestedIteration: (code.match(/\bfor\b/g) || []).length >= 2 || (code.match(/\bwhile\b/g) || []).length >= 2,
    exponentialRecursion: /fib|fibonacci|pow\(2|2\s*\*\s*\w+\s*\+/.test(lower),
  };
};

const buildResult = (complexity, reasons, suggestions) => {
  const meta = COMPLEXITY_META[complexity] || COMPLEXITY_META["O(n)"];
  const explanation =
    reasons.length > 0
      ? `${reasons.join(" ")} Therefore, estimated complexity is ${complexity}.`
      : `Estimated complexity is ${complexity}.`;

  return {
    complexity,
    level: meta.level,
    description: meta.description,
    explanation,
    reasons,
    suggestions,
  };
};

export const analyzeComplexity = (code, language = "javascript") => {
  if (!code?.trim()) {
    return buildResult("O(1)", ["No executable statements detected."], ["Add your algorithm to analyze complexity."]);
  }

  const cleaned = stripComments(code, language);
  const { maxDepth, loopCount } = measureLoopNesting(cleaned, language);
  const { hasRecursion, functionName } = detectRecursion(cleaned, language);
  const patterns = detectPatterns(cleaned);

  const reasons = [];
  const suggestions = [];

  if (loopCount === 0 && !hasRecursion) {
    reasons.push("The code has no loops or recursive calls.");
    return buildResult("O(1)", reasons, ["Constant-time operations are optimal for simple tasks."]);
  }

  if (patterns.exponentialRecursion && hasRecursion) {
    reasons.push(
      `Recursive calls (e.g. \`${functionName || "function"}\`) without memoization often lead to exponential growth.`
    );
    suggestions.push("Add memoization or convert to dynamic programming.", "Avoid redundant recursive subcalls.");
    return buildResult("O(2^n)", reasons, suggestions);
  }

  if (maxDepth >= 3) {
    reasons.push(`Detected ${maxDepth} levels of nested loops.`);
    suggestions.push("Reduce nesting by early breaks or hash-map lookups.", "Extract inner loops into helper functions.");
    return buildResult("O(n³)", reasons, suggestions);
  }

  if (maxDepth >= 2 || (patterns.nestedIteration && loopCount >= 2)) {
    reasons.push("The code contains nested loops that each iterate up to n times.");
    suggestions.push(
      "Can a single pass with O(1) extra space replace the inner loop?",
      "Consider sorting + two-pointer if searching pairs."
    );
    return buildResult("O(n²)", reasons, suggestions);
  }

  if (patterns.sorting && (hasRecursion || loopCount >= 1)) {
    reasons.push("Sorting or divide-and-conquer merge/quick sort patterns detected.");
    suggestions.push("Built-in sort is often O(n log n); verify in-place requirements.");
    return buildResult("O(n log n)", reasons, suggestions);
  }

  if (patterns.binarySearch || (patterns.divideConquer && hasRecursion)) {
    reasons.push("Halving search space (binary search / divide & conquer) reduces work logarithmically.");
    return buildResult("O(log n)", reasons, ["Ensure input is sorted for binary search."]);
  }

  if (hasRecursion) {
    reasons.push(`Function \`${functionName || "?"}\` calls itself — typical linear recursion is O(n).`);
    if (!patterns.exponentialRecursion) {
      suggestions.push("Tail-recursion may be optimized by some compilers.", "Watch stack depth for deep inputs.");
      return buildResult("O(n)", reasons, suggestions);
    }
  }

  if (loopCount === 1) {
    reasons.push("A single loop iterates over the input once.");
    suggestions.push("Combine multiple passes into one loop when possible.");
    return buildResult("O(n)", reasons, suggestions);
  }

  if (loopCount === 2 && maxDepth < 2) {
    reasons.push("Two sequential loops (not nested) still yield linear total work O(n).");
    return buildResult("O(n)", reasons, suggestions);
  }

  return buildResult("O(n)", ["General iterative structure detected."], suggestions);
};

export const generateComplexityCurves = (highlightComplexity) => {
  const nValues = Array.from({ length: 51 }, (_, i) => i * 2);

  const fns = {
    "O(1)": () => 1,
    "O(log n)": (n) => (n > 0 ? Math.log2(n + 1) * 15 : 0),
    "O(n)": (n) => n,
    "O(n log n)": (n) => (n > 0 ? n * Math.log2(n + 1) * 0.8 : 0),
    "O(n²)": (n) => (n * n) / 4,
    "O(n³)": (n) => (n * n * n) / 40,
    "O(2^n)": (n) => (n < 12 ? Math.pow(2, n / 2) : 2000),
  };

  const colors = {
    "O(1)": "#22d3ee",
    "O(log n)": "#a78bfa",
    "O(n)": "#34d399",
    "O(n log n)": "#fbbf24",
    "O(n²)": "#f472b6",
    "O(n³)": "#fb923c",
    "O(2^n)": "#ef4444",
  };

  const series = Object.entries(fns).map(([name, fn]) => ({
    name,
    color: colors[name],
    highlight: name === highlightComplexity,
    data: nValues.map((n) => ({ n, value: Math.min(fn(n), 2500) })),
  }));

  return { nValues, series };
};

/** Synthetic runtime samples for chart (scaled from measured ms). */
export const generateRuntimeSeries = (runtimeMs, complexity) => {
  const base = runtimeMs || 1;
  const scale = complexity?.level || 3;
  return Array.from({ length: 8 }, (_, i) => {
    const n = (i + 1) * 10;
    const factor = Math.pow(n / 10, scale > 4 ? 2 : scale > 3 ? 1.2 : 0.8);
    return { n, ms: Math.max(0.01, (base * factor) / 10) };
  });
};

export const generateMemorySeries = (memoryBytes) => {
  const base = memoryBytes || 1024;
  return Array.from({ length: 6 }, (_, i) => ({
    label: `T${i + 1}`,
    bytes: Math.round(base * (0.85 + i * 0.05)),
  }));
};

// Re-export for backward compatibility
export const generateComplexityData = (result) => {
  const name = typeof result === "string" ? result : result?.complexity;
  const { series } = generateComplexityCurves(name);
  return series.map((s) => ({
    name: s.name,
    color: s.color,
    data: s.data.map((d) => ({ x: d.n, y: d.value })),
  }));
};
