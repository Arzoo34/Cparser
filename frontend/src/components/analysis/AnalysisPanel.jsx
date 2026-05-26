import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaChartLine, FaClock, FaMemory, FaCheckCircle, FaLightbulb, FaArrowRight } from "react-icons/fa";
import {
  generateComplexityCurves,
  generateRuntimeSeries,
  generateMemorySeries,
} from "../../utils/complexityAnalyzer";

const TABS = [
  { id: "growth", label: "Complexity Curve" },
  { id: "runtime", label: "Runtime" },
  { id: "memory", label: "Memory" },
];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-600/80 bg-slate-900/95 px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-400 mb-1">n = {label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-mono">
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
};

const formatRuntime = (ms) => {
  if (!ms || ms === 0) return "N/A";
  if (ms < 1) return `${(ms * 1000).toFixed(2)} μs`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
};

const formatMemory = (bytes) => {
  if (!bytes || bytes === 0) return "N/A";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const AnalysisPanel = ({ complexity, runtime, memory, status = "Accepted" }) => {
  const [tab, setTab] = useState("growth");

  const { growthChartData, highlightSeries } = useMemo(() => {
    const { series } = generateComplexityCurves(complexity?.complexity);
    const data = series[0].data.map((_, i) => {
      const point = { n: series[0].data[i].n };
      series.forEach((s) => {
        point[s.name] = s.data[i].value;
      });
      return point;
    });
    return {
      growthChartData: data,
      highlightSeries: complexity?.complexity,
    };
  }, [complexity?.complexity]);

  const runtimeData = useMemo(
    () => generateRuntimeSeries(runtime, complexity),
    [runtime, complexity]
  );

  const memoryData = useMemo(() => generateMemorySeries(memory), [memory]);

  const seriesColors = {
    "O(1)": "#22d3ee",
    "O(log n)": "#a78bfa",
    "O(n)": "#34d399",
    "O(n log n)": "#fbbf24",
    "O(n²)": "#f472b6",
    "O(n³)": "#fb923c",
    "O(2^n)": "#ef4444",
  };

  return (
    <div className="rounded-xl border border-indigo-500/25 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-2xl">
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2 bg-gradient-to-r from-indigo-950/80 to-slate-900/80">
        <FaChartLine className="text-indigo-400" />
        <h2 className="text-sm font-bold text-white tracking-wide">Code Analysis</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 border-b border-white/5">
        {[
          { icon: FaChartLine, label: "Complexity", value: complexity?.complexity || "—", color: "text-cyan-400" },
          { icon: FaClock, label: "Runtime", value: formatRuntime(runtime), color: "text-emerald-400" },
          { icon: FaMemory, label: "Memory", value: formatMemory(memory), color: "text-violet-400" },
          { icon: FaCheckCircle, label: "Status", value: status, color: "text-amber-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-lg bg-slate-800/60 border border-white/5 px-3 py-2.5 hover:border-indigo-500/30 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 mb-1">
              <Icon className={color} />
              {label}
            </div>
            <div className={`text-sm font-bold text-white truncate ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {(complexity?.explanation || complexity?.reasons?.length > 0) && (
        <div className="px-4 py-3 border-b border-white/5 bg-indigo-950/30">
          <p className="text-xs text-slate-300 leading-relaxed">{complexity.explanation}</p>
          {complexity.reasons?.length > 0 && (
            <ul className="mt-2 space-y-1">
              {complexity.reasons.map((r) => (
                <li key={r} className="text-[11px] text-slate-500 flex gap-2">
                  <span className="text-indigo-400">•</span>
                  {r}
                </li>
              ))}
            </ul>
          )}
          {complexity.suggestions?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase text-amber-400/90 mb-1.5">
                <FaLightbulb />
                Suggestions
              </div>
              <ul className="space-y-1">
                {complexity.suggestions.map((s) => (
                  <li key={s} className="text-[11px] text-slate-400">
                    <FaArrowRight className="inline mr-1 text-[10px] opacity-60" aria-hidden />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-1 p-2 border-b border-white/5 bg-slate-950/50">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              tab === t.id
                ? "bg-indigo-500/30 text-indigo-200 border border-indigo-500/40"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="h-52 p-3">
        {tab === "growth" && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                {Object.entries(seriesColors).map(([name, color]) => (
                  <linearGradient key={name} id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={name === highlightSeries ? 0.4 : 0.05} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="n"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                label={{ value: "Input size (n)", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 10 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                width={36}
                label={{ value: "Operations", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 10 }}
              />
              <Tooltip content={<ChartTooltip />} />
              {Object.keys(seriesColors).map((name) => (
                <Area
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={seriesColors[name]}
                  strokeWidth={name === highlightSeries ? 3 : 1}
                  strokeOpacity={name === highlightSeries ? 1 : 0.25}
                  fill={`url(#grad-${name})`}
                  dot={false}
                  isAnimationActive
                  animationDuration={800}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}

        {tab === "runtime" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={runtimeData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="n" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: "Input scale", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} width={40} label={{ value: "ms", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 10 }} />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="ms"
                name="Runtime (ms)"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#34d399" }}
                activeDot={{ r: 5 }}
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {tab === "memory" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={memoryData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} width={44} tickFormatter={(v) => `${(v / 1024).toFixed(0)}K`} />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.[0] ? (
                    <div className="rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-xs">
                      {formatMemory(payload[0].value)}
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="bytes" name="Memory" fill="#8b5cf6" radius={[4, 4, 0, 0]} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {highlightSeries && (
        <p className="text-[10px] text-center text-slate-500 pb-3 px-4">
          Highlighted curve: <span className="text-indigo-300 font-semibold">{highlightSeries}</span> (your estimate)
        </p>
      )}
    </div>
  );
};

export default AnalysisPanel;
