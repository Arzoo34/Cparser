import { useState, useRef, useEffect } from "react";
import { LANGUAGE_VERSIONS } from "../constants";
import { FaChevronDown, FaCode } from "react-icons/fa";

const languages = Object.entries(LANGUAGE_VERSIONS);

const languageIcons = {
  javascript: "📜",
  typescript: "📘",
  python: "🐍",
  java: "☕",
  csharp: "🔷",
  php: "🐘",
  c: "⚙️",
  cpp: "⚡",
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
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <FaCode className="inline mr-2 text-purple-400" />
        Programming Language
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-700/50 hover:bg-gray-700 border border-purple-500/30 rounded-lg text-white transition-all duration-200 hover:border-purple-500/50"
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl">{languageIcons[language] || "📝"}</span>
          <span className="font-medium capitalize">{language}</span>
          <span className="text-xs text-gray-400">
            ({LANGUAGE_VERSIONS[language]})
          </span>
        </div>
        <FaChevronDown
          className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-purple-500/30 rounded-lg shadow-2xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {languages.map(([lang, version]) => (
              <button
                key={lang}
                onClick={() => {
                  onSelect(lang);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-purple-500/20 transition-colors duration-150 ${lang === language
                    ? "bg-purple-500/30 text-purple-300 border-l-4 border-purple-500"
                    : "text-gray-300"
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{languageIcons[lang] || "📝"}</span>
                  <span className="font-medium capitalize">{lang}</span>
                </div>
                <span className="text-xs text-gray-400">{version}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
