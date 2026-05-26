# Code Editor (Merged)

This folder is the original **code-editor** project. It has been integrated into the main Cparser application.

## Use the integrated app instead

All code editor features (multi-language editing, execution, output, complexity analysis) now live in:

```
Cparser/frontend/
├── editor.html          # Online Compiler entry point
├── src/                 # React app (editor, output, analysis)
├── visualizer.html      # C compiler phase visualizer
└── index.html           # Compiler design learning guide
```

### Run the unified project

```bash
# Terminal 1 — C parser backend (for visualizer)
cd backend
.\venv\Scripts\activate
python app.py

# Terminal 2 — Frontend (visualizer + learn + online compiler)
cd frontend
npm install
npm run dev
```

Then open:

- **C Parser Visualizer:** http://localhost:3000/visualizer.html
- **Learn guide:** http://localhost:3000/index.html
- **Online Compiler:** http://localhost:3000/editor.html (or use **Online Compiler** in the navbar)

You do not need to run `npm install` separately inside `Code-Editor/`.
