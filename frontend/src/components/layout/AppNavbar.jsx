import { useState } from "react";
import { FaCode } from "react-icons/fa";

const LINKS = [
  { label: "Home", href: "index.html" },
  { label: "Compiler Visualizer", href: "visualizer.html" },
  { label: "Code Editor", href: "editor.html" },
  { label: "About", href: "index.html#about" },
];

const AppNavbar = ({ active = "home" }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="index.html" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <FaCode className="text-white text-lg" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-white leading-tight">C Compiler Suite</div>
              <div className="text-[11px] text-slate-400">Visualizer & IDE</div>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active === link.label.toLowerCase().replace(" ", "-")
                    ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/30"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate-300"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavbar;
