import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { useAuth } from "../context/AuthContext";
import { FaCode, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CodeEditor = () => {
  const editorRef = useRef();
  const [language, setLanguage] = useState("javascript");
  const [value, setValue] = useState(CODE_SNIPPETS[language]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                <FaCode className="text-white text-2xl" />
              </div>
              <div>

                <h1 className="text-2xl font-bold text-white">Code Sheild </h1>
                <p className="text-gray-400 text-sm">Online Compiler & IDE</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <FaUser className="text-purple-400" />
                <span className="font-medium">{user?.name || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-200 border border-red-500/30"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-4 shadow-2xl">
            <LanguageSelector language={language} onSelect={onSelect} />
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
              <Editor
                options={{
                  minimap: {
                    enabled: false,
                  },
                  fontSize: 14,
                  wordWrap: "on",
                }}
                height="75vh"
                theme="vs-dark"
                language={language}
                defaultValue={CODE_SNIPPETS[language]}
                onMount={onMount}
                value={value}
                onChange={(value) => setValue(value)}
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-4 shadow-2xl">
            <Output editorRef={editorRef} language={language} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
