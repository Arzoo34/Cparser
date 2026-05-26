import { useState } from "react";
import { executeCode } from "../api";
import { analyzeComplexity } from "../utils/codeAnalyzer";
import { FaPlay, FaCheckCircle, FaExclamationCircle, FaSpinner, FaKeyboard, FaTerminal, FaChartBar, FaTimes } from "react-icons/fa";
import Analysis from "./Analysis";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [executionData, setExecutionData] = useState(null);
  const [complexity, setComplexity] = useState(null);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      setErrorMessage("Please write some code first!");
      setIsError(true);
      setOutput(null);
      setExecutionData(null);
      setComplexity(null);
      setShowAnalysis(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage("");

      // Analyze code complexity
      const codeComplexity = analyzeComplexity(sourceCode, language);
      setComplexity(codeComplexity);

      const startTime = performance.now();
      const response = await executeCode(language, sourceCode, input);
      const endTime = performance.now();
      const actualRuntime = endTime - startTime; // Time in milliseconds

      const { run: result } = response;

      if (result.stderr) {
        setIsError(true);
        setOutput(result.stderr.split("\n"));
        setExecutionData(null);
        setShowAnalysis(false);
      } else {
        setIsError(false);
        setOutput(result.output ? result.output.split("\n") : ["No output"]);

        // Store execution data for analysis
        // Piston API may return memory in bytes, or we estimate based on output
        const memoryUsed = result.memory || (result.output ? result.output.length * 100 : 0);

        setExecutionData({
          runtime: actualRuntime, // Actual execution time
          memory: memoryUsed,
          signal: result.signal || null,
        });
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
      setErrorMessage(error.message || "Unable to run code. Please try again.");
      setOutput(null);
      setExecutionData(null);
      setComplexity(null);
      setShowAnalysis(false);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="h-full flex flex-col">
      {/* Header with Run and Analysis Buttons */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          disabled={!executionData || isError || !complexity}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform ${executionData && !isError && complexity
              ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white hover:scale-105 shadow-lg"
              : "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
            }`}
        >
          <FaChartBar />
          <span>Analysis</span>
        </button>
        <button
          onClick={runCode}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <FaPlay />
              <span>Run Code</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Panel */}
      {showAnalysis && executionData && complexity && (
        <div className="mb-4">
          <Analysis
            complexity={complexity}
            runtime={executionData.runtime}
            memory={executionData.memory}
            memoryLimit={128 * 1024 * 1024} // 128MB default limit
          />
        </div>
      )}

      {/* Input Section */}
      <div className="flex-1 flex flex-col mb-4 min-h-[200px]">
        <div className="flex items-center space-x-2 mb-2">
          <FaKeyboard className="text-purple-400" />
          <label className="block text-sm font-medium text-gray-300">
            Input
          </label>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input for your program here...&#10;&#10;Example for Python:&#10;5&#10;10&#10;&#10;Example for C/C++:&#10;Hello World"
          className="flex-1 w-full p-4 bg-gray-900/50 border-2 border-gray-700 rounded-lg text-green-300 font-mono text-sm resize-none focus:outline-none focus:border-purple-500/50 placeholder-gray-600"
        />
        <p className="mt-2 text-xs text-gray-500">
          Tip: Each line will be read as separate input. Leave empty if your program doesn't need input.
        </p>
      </div>

      {/* Output Section */}
      <div className="flex-1 flex flex-col min-h-[200px]">
        <div className="flex items-center space-x-2 mb-2">
          <FaTerminal className="text-green-400" />
          <label className="block text-sm font-medium text-gray-300">
            Output
          </label>
        </div>
        <div
          className={`flex-1 p-4 rounded-lg border-2 overflow-y-auto font-mono text-sm ${isError
              ? "bg-red-900/20 border-red-500/50 text-red-300"
              : "bg-gray-900/50 border-gray-700 text-green-300"
            }`}
        >
          {errorMessage && (
            <div className="flex items-start space-x-2 mb-2 text-red-400">
              <FaExclamationCircle className="mt-1" />
              <span>{errorMessage}</span>
            </div>
          )}

          {output ? (
            <div className="space-y-1">
              {output.map((line, i) => (
                <div key={i} className="flex items-start">
                  <span className="text-gray-500 mr-2 select-none">{i + 1}</span>
                  <span className="flex-1">{line || "\u00A0"}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FaCheckCircle className="text-4xl mb-4 opacity-50" />
              <p className="text-center">
                Click "Run Code" to see the output here
              </p>
              <p className="text-xs mt-2 text-center opacity-75">
                Your code execution results will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Output;
