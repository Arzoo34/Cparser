import { useState, useEffect, useCallback } from "react";
import { executeCode, ExecutionError, EXECUTION_ERROR_TYPES } from "../services/executionService";
import { analyzeComplexity } from "../utils/complexityAnalyzer";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaKeyboard,
  FaTerminal,
  FaChartBar,
} from "react-icons/fa";
import AnalysisPanel from "./analysis/AnalysisPanel";

const friendlyError = (error) => {
  if (error instanceof ExecutionError) return error.message;
  return error?.message || "Unable to run code. Please try again.";
};

const Output = ({ editorRef, language, runTrigger = 0, onRunStateChange }) => {
  const [output, setOutput] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [executionData, setExecutionData] = useState(null);
  const [complexity, setComplexity] = useState(null);
  const [statusLabel, setStatusLabel] = useState("");

  const clearAll = useCallback(() => {
    setOutput(null);
    setIsError(false);
    setErrorMessage("");
    setErrorType(null);
    setExecutionData(null);
    setComplexity(null);
    setShowAnalysis(false);
    setStatusLabel("");
  }, []);

  const runCode = useCallback(async () => {
    const sourceCode = editorRef.current?.getValue?.() ?? "";
    if (!sourceCode.trim()) {
      setErrorMessage("Please write some code before running.");
      setErrorType(EXECUTION_ERROR_TYPES.VALIDATION);
      setIsError(true);
      setOutput(null);
      setExecutionData(null);
      setComplexity(null);
      setShowAnalysis(false);
      setStatusLabel("");
      return;
    }

    setIsLoading(true);
    onRunStateChange?.(true);
    setIsError(false);
    setErrorMessage("");
    setErrorType(null);
    setStatusLabel("Submitting…");

    try {
      const codeComplexity = analyzeComplexity(sourceCode, language);
      setComplexity(codeComplexity);

      setStatusLabel("Executing…");
      const startTime = performance.now();
      const response = await executeCode(language, sourceCode, input);
      const wallClockMs = performance.now() - startTime;

      const result = response?.run;
      if (!result) {
        setIsError(true);
        setErrorMessage(
          response?.error?.message || "No execution result returned from the server."
        );
        setErrorType(response?.error?.type || EXECUTION_ERROR_TYPES.API);
        setOutput(null);
        setExecutionData(null);
        setShowAnalysis(false);
        setStatusLabel("Failed");
        return;
      }

      const runtimeMs = result.runtime_ms ?? wallClockMs;
      setStatusLabel(response?.status || (response?.success ? "Accepted" : "Finished"));

      if (result.stderr) {
        setIsError(true);
        setErrorType(response?.error?.type || EXECUTION_ERROR_TYPES.RUNTIME);
        setErrorMessage(response?.error?.message || "");
        setOutput(String(result.stderr).split("\n"));
        setExecutionData(null);
        setShowAnalysis(false);
        return;
      }

      setIsError(false);
      setErrorMessage("");
      setOutput(result.output ? String(result.output).split("\n") : ["No output"]);
      setExecutionData({
        runtime: runtimeMs,
        memory: result.memory || 0,
        signal: result.signal || null,
      });
      setShowAnalysis(true);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setErrorMessage(friendlyError(error));
      setErrorType(
        error instanceof ExecutionError ? error.type : EXECUTION_ERROR_TYPES.UNKNOWN
      );
      setOutput(null);
      setExecutionData(null);
      setComplexity(null);
      setShowAnalysis(false);
      setStatusLabel("Error");
    } finally {
      setIsLoading(false);
      onRunStateChange?.(false);
    }
  }, [editorRef, language, input, onRunStateChange]);

  useEffect(() => {
    if (runTrigger > 0) runCode();
    if (runTrigger === -1) clearAll();
  }, [runTrigger, runCode, clearAll]);

  return (
    <div className="h-full flex flex-col min-h-0 gap-2">
      <div className="shrink-0 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowAnalysis(!showAnalysis)}
          disabled={!executionData || isError || !complexity || isLoading}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
            executionData && !isError && complexity && !isLoading
              ? "bg-indigo-500/30 text-indigo-200 border border-indigo-500/40"
              : "bg-slate-800 text-slate-600 cursor-not-allowed"
          }`}
        >
          <FaChartBar />
          {showAnalysis ? "Hide Analysis" : "Show Analysis"}
        </button>
        {isLoading && (
          <span className="text-xs text-indigo-300 flex items-center gap-1.5">
            <FaSpinner className="animate-spin" />
            {statusLabel}
          </span>
        )}
      </div>

      {showAnalysis && complexity && (
        <div className="shrink-0 max-h-[55%] overflow-y-auto">
          <AnalysisPanel
            complexity={complexity}
            runtime={executionData?.runtime}
            memory={executionData?.memory}
            status={statusLabel || "—"}
          />
        </div>
      )}

      <div className="flex-1 min-h-0 grid grid-rows-2 gap-2">
        <div className="flex flex-col min-h-0">
          <div className="shrink-0 flex items-center gap-1.5 mb-1">
            <FaKeyboard className="text-violet-400 text-xs" />
            <label className="text-xs font-medium text-slate-400">Input</label>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="stdin (one value per line)…"
            className="flex-1 min-h-0 w-full p-2.5 rounded-lg bg-slate-950/80 border border-slate-700 text-emerald-300/90 font-mono text-xs resize-none focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col min-h-0">
          <div className="shrink-0 flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <FaTerminal className="text-emerald-400 text-xs" />
              <label className="text-xs font-medium text-slate-400">Output</label>
            </div>
            {statusLabel && !isLoading && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  isError ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                {statusLabel}
              </span>
            )}
          </div>
          <div
            className={`flex-1 min-h-0 p-2.5 rounded-lg border overflow-y-auto font-mono text-xs ${
              isError
                ? "bg-red-950/40 border-red-500/40 text-red-200"
                : "bg-slate-950/80 border-slate-700 text-emerald-300/90"
            }`}
          >
            {errorMessage && (
              <div className="flex items-start gap-2 mb-2 text-red-400">
                <FaExclamationCircle className="mt-0.5 shrink-0" />
                <div>
                  {errorType && (
                    <div className="text-[10px] uppercase tracking-wide opacity-70 mb-0.5">
                      {errorType}
                    </div>
                  )}
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {output ? (
              <div className="space-y-0.5">
                {output.map((line, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-slate-600 select-none w-5 text-right shrink-0">{i + 1}</span>
                    <span className="flex-1 break-all whitespace-pre-wrap">{line || "\u00A0"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 py-6">
                <FaCheckCircle className="text-2xl mb-2 opacity-40" />
                <p className="text-xs">Use Run in the toolbar to execute code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Output;
