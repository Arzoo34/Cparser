import {
  FaPlay,
  FaTrash,
  FaCopy,
  FaDownload,
  FaExpand,
  FaCompress,
  FaMoon,
  FaSun,
  FaSpinner,
} from "react-icons/fa";

const EditorToolbar = ({
  onRun,
  onClear,
  onCopy,
  onDownload,
  isFullscreen,
  onToggleFullscreen,
  isDarkTheme,
  onToggleTheme,
  isLoading,
}) => (
  <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-white/10 mb-2">
    <button
      type="button"
      onClick={onRun}
      disabled={isLoading}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 transition-all"
    >
      {isLoading ? <FaSpinner className="animate-spin" /> : <FaPlay />}
      Run
    </button>
    <button
      type="button"
      onClick={onClear}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10"
      title="Clear output"
    >
      <FaTrash /> Clear
    </button>
    <button
      type="button"
      onClick={onCopy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10"
      title="Copy code"
    >
      <FaCopy /> Copy
    </button>
    <button
      type="button"
      onClick={onDownload}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10"
      title="Download code"
    >
      <FaDownload /> Save
    </button>
    <div className="flex-1" />
    <button
      type="button"
      onClick={onToggleTheme}
      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10"
      title="Toggle editor theme"
    >
      {isDarkTheme ? <FaSun /> : <FaMoon />}
    </button>
    <button
      type="button"
      onClick={onToggleFullscreen}
      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10"
      title="Toggle fullscreen"
    >
      {isFullscreen ? <FaCompress /> : <FaExpand />}
    </button>
  </div>
);

export default EditorToolbar;
