# Installation Guide

## Prerequisites

Before installing the project, make sure you have the following installed on your system:

- **Node.js** (version 16.x or higher recommended)
- **npm** (comes with Node.js) or **yarn**

You can check if you have them installed by running:
```bash
node --version
npm --version
```

## Installation Steps

### 1. Clone or Download the Project

Navigate to the project directory:
```bash
cd react-code-editor-app-main
```

### 2. Install All Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`.

## Complete List of Dependencies

### Production Dependencies

These packages are required for the application to run:

1. **@chakra-ui/react** (^2.10.9) - UI component library (legacy, can be removed if not used)
2. **@emotion/react** (^11.11.3) - CSS-in-JS library for Chakra UI
3. **@emotion/styled** (^11.11.0) - Styled components for Emotion
4. **@monaco-editor/react** (^4.7.0) - Monaco Editor (VS Code editor) for React
5. **@supabase/supabase-js** (^2.81.1) - Supabase client library for authentication
6. **axios** (^1.6.7) - HTTP client for API requests
7. **framer-motion** (^11.0.3) - Animation library (for Chakra UI)
8. **react** (^18.2.0) - React library
9. **react-dom** (^18.2.0) - React DOM renderer
10. **react-icons** (^5.5.0) - Icon library
11. **react-router-dom** (^7.9.6) - Routing library for React
12. **recharts** (^3.4.1) - Charting library for complexity graphs

### Development Dependencies

These packages are only needed during development:

1. **@types/react** (^18.2.43) - TypeScript types for React
2. **@types/react-dom** (^18.2.17) - TypeScript types for React DOM
3. **@vitejs/plugin-react** (^4.2.1) - Vite plugin for React
4. **autoprefixer** (^10.4.22) - PostCSS plugin for CSS vendor prefixes
5. **eslint** (^8.55.0) - JavaScript linter
6. **eslint-plugin-react** (^7.33.2) - ESLint plugin for React
7. **eslint-plugin-react-hooks** (^4.6.0) - ESLint plugin for React Hooks
8. **eslint-plugin-react-refresh** (^0.4.5) - ESLint plugin for React Fast Refresh
9. **postcss** (^8.5.6) - CSS post-processor
10. **tailwindcss** (^3.4.0) - Utility-first CSS framework
11. **vite** (^5.0.8) - Build tool and development server

## Quick Install Command

To install all dependencies at once, simply run:

```bash
npm install
```

Or if you prefer to install them individually:

```bash
# Production dependencies
npm install @chakra-ui/react @emotion/react @emotion/styled @monaco-editor/react @supabase/supabase-js axios framer-motion react react-dom react-icons react-router-dom recharts

# Development dependencies
npm install --save-dev @types/react @types/react-dom @vitejs/plugin-react autoprefixer eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh postcss tailwindcss vite
```

## Configuration Files Required

Make sure these configuration files exist in your project root:

1. **tailwind.config.js** - Tailwind CSS configuration
2. **postcss.config.js** - PostCSS configuration
3. **vite.config.js** - Vite configuration
4. **package.json** - Node.js package configuration

## Environment Setup

### Supabase Configuration

The project uses Supabase for authentication. Make sure you have:

1. A Supabase project created
2. Your Supabase URL and anon key configured in `src/lib/supabase.js`

The configuration should look like:
```javascript
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'
```

## Running the Project

After installing all dependencies:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Troubleshooting

### If you encounter installation errors:

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and package-lock.json:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Update npm:**
   ```bash
   npm install -g npm@latest
   ```

4. **Check Node.js version:**
   Make sure you're using Node.js 16.x or higher.

## System Requirements

- **Operating System:** Windows, macOS, or Linux
- **Node.js:** 16.x or higher
- **npm:** 7.x or higher (or yarn 1.22.x or higher)
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk Space:** At least 500MB free space

## Additional Notes

- The project uses **Vite** as the build tool, which is faster than Create React App
- **Tailwind CSS** is used for styling (replacing Chakra UI in most components)
- **Monaco Editor** is used for the code editor (same editor as VS Code)
- **Supabase** handles authentication with OTP support
- **Recharts** is used for displaying complexity analysis graphs

