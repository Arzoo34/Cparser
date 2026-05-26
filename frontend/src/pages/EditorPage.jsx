import { useRef, useState, useCallback } from "react";
import { Editor } from "@monaco-editor/react";
import AppNavbar from "../components/layout/AppNavbar";
import LanguageSelector from "../components/LanguageSelector";
import Output from "../components/Output";
import EditorToolbar from "../components/editor/EditorToolbar";
import { CODE_SNIPPETS } from "../constants";

const EXTENSIONS = {
  javascript: "js",
  python: "py",
  java: "java",
  c: "c",
  cpp: "cpp",
};

const EditorPage = () => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  const [value, setValue] = useState(CODE_SNIPPETS.javascript);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [outputCollapsed, setOutputCollapsed] = useState(false);
  const [runTrigger, setRunTrigger] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (lang) => {
    setLanguage(lang);
    setValue(CODE_SNIPPETS[lang]);
  };

  const handleCopy = async () => {
    const code = editorRef.current?.getValue?.() ?? value;
    await navigator.clipboard.writeText(code);
  };

  const handleDownload = () => {
    const code = editorRef.current?.getValue?.() ?? value;
    const ext = EXTENSIONS[language] || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-slate-950 text-white ${
        isFullscreen ? "h-screen" : "min-h-screen"
      }`}
    >
      {!isFullscreen && <AppNavbar active="code-editor" />}

      <div className="flex-1 min-h-0 flex flex-col p-3 gap-3 max-w-[1920px] w-full mx-auto">
        <div
          className={`flex-1 min-h-0 grid gap-3 ${
            outputCollapsed ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2"
          }`}
        >
          <section className="flex flex-col min-h-0 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="px-3 pt-3 shrink-0">
              <EditorToolbar
                onRun={() => setRunTrigger((t) => t + 1)}
                onClear={() => setRunTrigger(-1)}
                onCopy={handleCopy}
                onDownload={handleDownload}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
                isDarkTheme={isDarkTheme}
                onToggleTheme={() => setIsDarkTheme((d) => !d)}
                isLoading={isRunning}
              />
              <LanguageSelector language={language} onSelect={onSelect} />
            </div>
            <div className="flex-1 min-h-[280px] m-3 mt-2 rounded-lg overflow-hidden border border-slate-700/80">
              <Editor
                height="100%"
                theme={isDarkTheme ? "vs-dark" : "light"}
                language={language}
                value={value}
                onChange={setValue}
                onMount={onMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontLigatures: true,
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 12 },
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  bracketPairColorization: { enabled: true },
                }}
              />
            </div>
          </section>

          {!outputCollapsed && (
            <section className="flex flex-col min-h-0 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-xl p-3 min-h-[320px]">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Output & Analysis
                </span>
                <button
                  type="button"
                  onClick={() => setOutputCollapsed(true)}
                  className="text-xs text-slate-500 hover:text-white xl:hidden"
                >
                  Hide
                </button>
              </div>
              <Output
                editorRef={editorRef}
                language={language}
                runTrigger={runTrigger}
                onRunStateChange={setIsRunning}
              />
            </section>
          )}
        </div>

        {outputCollapsed && (
          <button
            type="button"
            onClick={() => setOutputCollapsed(false)}
            className="shrink-0 py-2 text-sm text-indigo-400 hover:text-indigo-300"
          >
            Show output panel ↑
          </button>
        )}
      </div>
    </div>
  );
};

export default EditorPage;
