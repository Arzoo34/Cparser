import { useState, useRef, useEffect } from "react";
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from "../constants";
import { FaChevronDown, FaCode, FaJs, FaPython, FaJava } from "react-icons/fa";
import { SiC, SiCplusplus } from "react-icons/si";

const LANGUAGE_ICON = {
  javascript: FaJs,
  python: FaPython,
  java: FaJava,
  c: SiC,
  cpp: SiCplusplus,
};

const LANG_COLORS = {
  javascript: "text-yellow-400",
  python: "text-blue-400",
  java: "text-orange-400",
  c: "text-slate-300",
  cpp: "text-cyan-400",
};

const LangIcon = ({ lang }) => {
  const Icon = LANGUAGE_ICON[lang] || FaCode;
  return <Icon className={`text-lg ${LANG_COLORS[lang] || "text-slate-400"}`} aria-hidden />;
};

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-2" ref={dropdownRef}>
      <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
        <FaCode className="inline mr-1 text-indigo-400" />
        Language
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-600/50 rounded-lg text-white text-sm transition-all hover:border-indigo-500/40"
      >
        <div className="flex items-center gap-2">
          <LangIcon lang={language} />
          <span className="font-medium capitalize">{language}</span>
          <span className="text-xs text-gray-400">({LANGUAGE_LABELS[language]})</span>
        </div>
        <FaChevronDown
          className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-indigo-500/30 rounded-lg shadow-2xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  onSelect(lang);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-indigo-500/20 transition-colors ${
                  lang === language
                    ? "bg-indigo-500/30 text-indigo-200 border-l-4 border-indigo-500"
                    : "text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <LangIcon lang={lang} />
                  <span className="font-medium capitalize">{lang}</span>
                </div>
                <span className="text-xs text-slate-500">{LANGUAGE_LABELS[lang]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
