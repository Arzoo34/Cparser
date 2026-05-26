# 🚀 C Parser Visualizer

An educational web platform for **C compiler phase visualization** and an integrated **online multi-language code editor**.

[![GitHub](https://img.shields.io/badge/GitHub-omi290%2FCparser-blue)](https://github.com/omi290/Cparser)
[![Python](https://img.shields.io/badge/Python-3.8+-green)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-black)](https://flask.palletsprojects.com/)

---

## 📖 Overview

**C Parser Visualizer** is the core app: visualize lexical analysis, parsing, semantic analysis, and intermediate code generation for C programs.

**Online Compiler** (integrated from the code-editor project) adds a full IDE: write code in multiple languages, run it, view output, and analyze time complexity — reachable from the navbar on every page.

### C Compiler Visualizer

- ✅ Lexical analysis — token table and colored token stream
- ✅ Syntax analysis — parse tree / AST visualization
- ✅ Semantic analysis — symbol table and type checking
- ✅ Intermediate code generation — three-address code and quadruples
- ✅ Pipeline animations and parser trace
- ✅ Learn guide for all 7 compiler phases (`learn.html`)

### Online Compiler (integrated code editor)

- ✅ Multi-language editor (JavaScript, Python, C, C++, Java, TypeScript, C#, PHP)
- ✅ Run code via Judge0 CE API (proxied through Flask) with stdin support
- ✅ Output panel with error highlighting
- ✅ Time / space complexity analysis with charts
- ✅ Navigation link back to the C compiler visualizer

### Supported C Subset

**Keywords**: `int`, `float`, `char`, `if`, `else`, `while`, `for`, `return`  
**Operators**: `+`, `-`, `*`, `/`, `=`, `==`, `<`, `>`, `<=`, `>=`  
**Separators**: `;`, `{`, `}`, `(`, `)`  
**Identifiers**: Variable and function names  
**Numbers**: Integers and floating-point numbers

---

## 🏗️ Architecture

```
┌─────────────────┐         HTTP/JSON         ┌──────────────────┐
│  React Frontend │ ◄─────────────────────► │  Flask Backend   │
│   (Port 3000)   │                           │   (Port 5000)    │
└─────────────────┘                           └──────────────────┘
        │                                              │
        │                                              │
   ┌────▼────┐                                   ┌────▼─────┐
   │  Vite   │                                   │ Tokenizer│
   │  Build  │                                   │  Engine  │
   └─────────┘                                   └──────────┘
```

**Tech Stack:**
- **Frontend**: React 18, Vite, Tailwind CSS, Axios
- **Backend**: Python 3.8+, Flask 3.0, Flask-CORS
- **Tokenizer**: Regex-based lexical analyzer

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/omi290/Cparser.git
cd Cparser
```

**2. Backend Setup:**
```bash
cd backend
setup.bat
```
This creates a virtual environment and installs all Python dependencies.

**3. Frontend Setup:**
```bash
cd frontend
npm install
```

### Running the Application

You need **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
.\venv\Scripts\activate
python app.py
```
✅ Server runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ App runs on: http://localhost:3000

**Open in your browser:**

| Page | URL |
|------|-----|
| Home (landing page) | http://localhost:3000/ |
| C Parser Visualizer | http://localhost:3000/visualizer.html |
| Compiler design guide | http://localhost:3000/learn.html |
| Online Compiler | http://localhost:3000/editor.html |

Use **Online Compiler** in the top navigation on any page to switch to the code editor.

---

## 📖 Usage

### C Parser Visualizer

1. Open **visualizer.html**
2. Enter C code in the editor (or use sample snippets)
3. Click **Analyze** to run the full pipeline
4. Switch tabs: Lexical → Syntax → Semantic → ICG

### Online Compiler

1. Open **editor.html** (or click **Online Compiler** in the navbar)
2. Pick a language, write code, optionally add stdin
3. Click **Run Code** — output appears on the right
4. Click **Analysis** for complexity charts and runtime stats
5. Use **Compiler Visualizer** in the header to return to the C parser tool

### Example

**Input:**
```c
int main() {
    int a = 5;
    float b = 3.14;
    return 0;
}
```

**Output:**
- Token table showing each token's type, value, and line number
- Colored visualization with syntax highlighting

---

## 📁 Project Structure

```
Cparser/
├── backend/                    # Flask API (C parser visualizer)
│   ├── lexer/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/                   # Unified frontend (Vite multi-page)
│   ├── index.html              # Landing homepage (React)
│   ├── learn.html              # Compiler design learning guide
│   ├── visualizer.html         # C parser visualizer
│   ├── editor.html             # Online compiler (React)
│   ├── public/app.js           # Visualizer client logic
│   ├── style.css / learn.css
│   ├── src/                    # React app for online compiler
│   │   ├── components/         # CodeEditor, Output, Analysis
│   │   └── utils/              # Complexity analyzer
│   ├── package.json
│   └── vite.config.js
│
├── Code-Editor/                # Original editor repo (reference only)
└── README.md
```

---

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173
FLASK_DEBUG=True
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT_MS=65000
```

### Backend — Online Compiler (Judge0 CE)
```env
JUDGE0_BASE_URL=https://ce.judge0.com
JUDGE0_TIMEOUT_SECONDS=60
```

No API key is required for the public Judge0 CE instance. The backend proxies execution to avoid browser CORS issues.

---

## 🛠️ Development

### Backend Development

```bash
cd backend
.\venv\Scripts\activate
python app.py
```

**Run tests:**
```bash
python test_tokenizer.py
```

### Frontend Development

```bash
cd frontend
npm run dev
```

**Build for production:**
```bash
npm run build
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Find process using port:**
```bash
netstat -ano | findstr :3000
```

**Kill process:**
```bash
taskkill /PID <PROCESS_ID> /F
```

### Backend Connection Failed

1. Ensure backend is running on port 5000
2. Check CORS settings in `backend/.env`
3. Restart both servers

### Module Not Found

```bash
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

**For complete troubleshooting guide, see:** [RUNNING_GUIDE.md](RUNNING_GUIDE.md)

---

## 📚 Documentation

- **[RUNNING_GUIDE.md](RUNNING_GUIDE.md)** - Complete guide to run the project
- **[backend/README.md](backend/README.md)** - Backend setup details
- **Environment Configuration** - See `.env.example` files

---

## 🗺️ Roadmap

### Phase 1: Lexical Analysis ✅ (Current)
- [x] Tokenizer implementation
- [x] Token visualization
- [x] Web interface
- [x] Tabbed UI for future phases

### Phase 2: Semantic Analysis 🚧 (Planned)
- [ ] Symbol table generation
- [ ] Variable tracking
- [ ] Scope management
- [ ] Type checking

### Phase 3: Syntax Analysis 🚧 (Planned)
- [ ] Parse tree generation
- [ ] AST visualization
- [ ] Syntax error reporting

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available for educational purposes.

---

## 👤 Author

**omi290**
- GitHub: [@omi290](https://github.com/omi290)
- Repository: [Cparser](https://github.com/omi290/Cparser)

---

## 🙏 Acknowledgments

- Built with React, Flask, and modern web technologies
- Inspired by compiler design principles
- Created as an educational tool for learning compilation phases

---

## 📧 Support

If you have any questions or run into issues:
1. Check the [RUNNING_GUIDE.md](RUNNING_GUIDE.md)
2. Open an issue on GitHub
3. Review the troubleshooting section above

---

**⭐ Star this repository if you find it helpful!**
