#!/usr/bin/env python3
"""Fix learn.html: nav, icons, arrows, shared scripts."""
from pathlib import Path

LEARN = Path(__file__).resolve().parent.parent / "learn.html"
text = LEARN.read_text(encoding="utf-8")

# Head: add shared assets
if "shared-ui.css" not in text:
    text = text.replace(
        '<link rel="stylesheet" href="learn.css" />',
        '<link rel="stylesheet" href="learn.css" />\n  <link rel="stylesheet" href="shared-ui.css" />',
    )

# Nav brand + links
text = text.replace(
    '<a href="visualizer.html" class="nav-logo" title="Back to Parser">C</a>',
    '<a href="index.html" class="nav-logo" title="Home">C</a>',
)
old_nav_right = """    <div class="nav-right">
      <a href="visualizer.html" class="nav-learn-btn" title="Back to Parser Tool">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Parser Tool
      </a>
      <button class="theme-toggle" """

new_nav_right = """    <div class="nav-right">
      <a href="index.html" class="nav-learn-btn" title="Home">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Home
      </a>
      <a href="visualizer.html" class="nav-learn-btn" title="Compiler Visualizer">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Visualizer
      </a>
      <a href="editor.html" class="nav-learn-btn" title="Online Code Editor">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Editor
      </a>
      <button class="theme-toggle" """
text = text.replace(old_nav_right, new_nav_right)

text = text.replace(
    '<span class="theme-toggle-icon" id="theme-icon">🌙</span>',
    '<span class="theme-toggle-icon" id="theme-icon"></span>',
)

text = text.replace(
    '<span class="learn-hero-badge">📚 Educational Resource</span>',
    '<span class="learn-hero-badge badge-with-icon"><span class="ui-icon" data-icon="book"></span> Educational Resource</span>',
)

# Pipeline arrows — CSS-generated
text = text.replace('<span class="lhp-arrow">→</span>', '<span class="lhp-arrow" aria-hidden="true"></span>')

# Section headings
text = text.replace(
    "<h3>🔑 Key Concepts</h3>",
    '<h3 class="heading-with-icon"><span class="ui-icon" data-icon="key"></span> Key Concepts</h3>',
)

# Learn more buttons
text = text.replace(
    "📖 Learn More — GeeksForGeeks",
    '<span class="learn-more-btn"><span class="ui-icon" data-icon="external"></span> Learn More &mdash; GeeksForGeeks</span>',
)
text = text.replace(
    "📘 Wikipedia —",
    '<span class="learn-more-btn"><span class="ui-icon" data-icon="document"></span> Wikipedia &mdash;</span>',
)
text = text.replace(
    "📗 TutorialsPoint Guide",
    '<span class="learn-more-btn"><span class="ui-icon" data-icon="document"></span> TutorialsPoint Guide</span>',
)

# Error example
text = text.replace(
    '→ ❌ <span style="color:var(--error)">',
    '→ <span class="ui-status-error"><span class="ui-icon" data-icon="xCircle"></span></span> <span style="color:var(--error)">',
)

# Resources section
text = text.replace(
    "<h2>📚 Recommended Textbooks & Resources</h2>",
    '<h2 class="heading-with-icon"><span class="ui-icon" data-icon="book"></span> Recommended Textbooks &amp; Resources</h2>',
)
text = text.replace('<div class="res-icon">🐉</div>', '<div class="res-icon" data-icon="sparkles"></div>')
text = text.replace('<div class="res-icon">🛠️</div>', '<div class="res-icon" data-icon="wrench"></div>')
text = text.replace('<div class="res-icon">🎓</div>', '<div class="res-icon" data-icon="academic"></div>')
text = text.replace(
    '<div class="res-icon">⚙️</div>',
    '<div class="res-icon" data-icon="wrench"></div>',
)

# Footer
text = text.replace(
    '<a href="visualizer.html">← Back to Parser</a>',
    '<a href="visualizer.html">&larr; Back to Parser</a>',
)

# Replace theme script block
old_script_start = "  <script>\n    // Theme toggle"
old_script_end = "    document.querySelectorAll('.phase-card, .resource-card').forEach(el => observer.observe(el));\n  </script>"

new_scripts = """  <script src="icons.js"></script>
  <script src="theme.js"></script>
  <script>
    document.querySelectorAll('[data-icon]').forEach((el) => {
      const name = el.getAttribute('data-icon');
      if (window.CParserIcons && window.CParserIcons[name]) {
        el.innerHTML = window.CParserIcons[name];
      }
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.phase-card, .resource-card').forEach(el => observer.observe(el));
  </script>"""

if old_script_start in text:
    start = text.index(old_script_start)
    end = text.index(old_script_end) + len(old_script_end)
    text = text[:start] + new_scripts + text[end:]

LEARN.write_text(text, encoding="utf-8", newline="\n")
print("Updated", LEARN)
