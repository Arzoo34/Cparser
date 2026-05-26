import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import AppNavbar from "../components/layout/AppNavbar";
import FeatureCard from "../components/home/FeatureCard";
import { FEATURES } from "../constants/features";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px]" />
      </div>

      <AppNavbar active="home" />

      <main className="relative">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300">
              Educational Compiler Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-indigo-100 to-violet-200 bg-clip-text text-transparent">
                C Compiler Visualizer
              </span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-400 mt-2 block">
                & Online Code Editor
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed mb-10">
              Visualize every phase of compilation for C programs, learn compiler design interactively,
              write and execute code in multiple languages, and analyze time complexity with professional charts.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="visualizer.html"
                className="px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02]"
              >
                Open Compiler Visualizer
              </a>
              <a
                href="editor.html"
                className="px-8 py-3.5 rounded-xl font-semibold border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur transition-all"
              >
                Launch Code Editor
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-slate-500"
          >
            {["Lexical → Syntax → Semantic → ICG", "5 Languages", "Judge0 Execution", "Complexity Analysis"].map(
              (t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t}
                </span>
              )
            )}
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Platform Features</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Everything you need to understand compilers and practice coding in one integrated suite.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.id} feature={f} index={i} />
            ))}
          </div>
        </section>

        <section id="about" className="border-t border-white/10 bg-slate-900/50 py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">About This Project</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Built for students and developers learning compiler construction. The visualizer walks through
              tokenization, parsing, semantic analysis, and intermediate code generation. The online IDE
              supports real execution and algorithmic complexity estimation.
            </p>
            <a href="learn.html" className="text-indigo-400 hover:text-indigo-300 font-medium text-sm">
              Read the full compiler design guide
              <FaArrowRight className="inline ml-1 text-xs" aria-hidden />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        C Parser Visualizer & Online Code Editor — Educational Project
      </footer>
    </div>
  );
};

export default HomePage;
