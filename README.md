# Notuly - AI-Powered Note Taking

🎯 **Transform your thoughts into intelligent notes with AI-powered voice recording and smart insights**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)

## 🚀 Quick Start untuk Teamwork

### 1. Prerequisites
- **Node.js**: v18.0.0 atau lebih tinggi (Recommended: v22.0.0)
- **npm**: v8.0.0 atau lebih tinggi
- **PostgreSQL**: v13.0 atau lebih tinggi
- **Git**: Latest version

### 2. Clone & Setup
```bash
# Clone repository
git clone <repository-url>
cd Notuly

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Setup database (edit .env first!)
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

### 3. Team Development Workflow
```bash
# 1. Pull latest changes
git pull origin main

# 2. Install new dependencies (if any)
npm install

# 3. Update database schema (if changed)
npx prisma migrate dev

# 4. Start coding!
npm run dev
```

## 📁 Struktur Folder & Penjelasan

```
Notuly/
├── 📁 app/                          # Main application code
│   ├── 📄 app.css                   # Global styles + TailwindCSS
│   ├── 📄 root.tsx                  # Root component dengan theme provider
│   ├── 📄 routes.ts                 # Route configuration
│   │
│   ├── 📁 components/               # Shared UI components
│   │   ├── 📄 landing-page.tsx      # Homepage component
│   │   ├── 📄 theme-toggle.tsx      # Dark/light mode toggle
│   │   ├── 📁 forms/                # Form-related components
│   │   │   ├── 📄 field.tsx         # Reusable form field
│   │   │   ├── 📄 form.tsx          # Base form component
│   │   │   └── 📄 form-drawer.tsx   # Slide-out form
│   │   ├── 📁 layout/               # Layout components
│   │   │   ├── 📄 header.tsx        # App header
│   │   │   ├── 📄 sidebar.tsx       # Navigation sidebar
│   │   │   └── 📄 main-layout.tsx   # Main layout wrapper
│   │   └── 📁 ui/                   # shadcn/ui components
│   │       ├── 📄 button.tsx        # Button component
│   │       ├── 📄 card.tsx          # Card component
│   │       ├── 📄 input.tsx         # Input component
│   │       └── 📄 modal.tsx         # Modal component
│   │
│   ├── 📁 features/                 # Feature-based modules (Bulletproof React)
│   │   ├── 📁 notes/                # 📝 Notes management feature
│   │   │   ├── 📁 api/              # API calls for notes
│   │   │   ├── 📁 components/       # Notes-specific components
│   │   │   ├── 📁 hooks/            # Notes-specific hooks
│   │   │   ├── 📁 stores/           # Notes state management
│   │   │   └── 📁 types/            # Notes TypeScript types
│   │   ├── 📁 voice/                # 🎙️ Voice recording feature
│   │   │   ├── 📁 api/              # Voice API integration
│   │   │   ├── 📁 components/       # Voice UI components
│   │   │   ├── 📁 hooks/            # Voice recording hooks
│   │   │   ├── 📁 stores/           # Voice state management
│   │   │   └── 📁 types/            # Voice TypeScript types
│   │   ├── 📁 ai/                   # 🤖 AI processing feature
│   │   │   ├── 📁 api/              # AI service integration
│   │   │   ├── 📁 components/       # AI UI components
│   │   │   ├── 📁 hooks/            # AI processing hooks
│   │   │   └── 📁 stores/           # AI state management
│   │   └── 📁 auth/                 # 🔐 Authentication feature
│   │       ├── 📁 api/              # Auth API calls
│   │       ├── 📁 components/       # Login/signup components
│   │       ├── 📁 hooks/            # Auth hooks
│   │       └── 📁 stores/           # Auth state management
│   │
│   ├── 📁 routes/                   # React Router v7 file-based routing
│   │   ├── 📄 _layout.tsx           # Main layout with header & theme
│   │   ├── 📄 home.tsx              # Homepage route
│   │   ├── 📁 notes/                # Notes routes
│   │   │   ├── 📄 _index.tsx        # /notes - list all notes
│   │   │   ├── 📄 new.tsx           # /notes/new - create note
│   │   │   └── 📄 $noteId.tsx       # /notes/:id - view/edit note
│   │   ├── 📁 voice/                # Voice routes
│   │   │   ├── 📄 _index.tsx        # /voice - voice features
│   │   │   └── 📄 record.tsx        # /voice/record - recording UI
│   │   └── 📁 api/                  # API routes
│   │       └── 📄 voice.ts          # /api/voice - voice processing
│   │
│   ├── 📁 lib/                      # Shared utilities
│   │   ├── 📄 utils.ts              # General utility functions
│   │   └── 📄 theme-utils.ts        # Feature-specific theme management
│   │
│   ├── 📁 providers/                # React context providers
│   │   └── 📄 theme-provider.tsx    # Theme context (dark/light mode)
│   │
│   ├── 📁 hooks/                    # Shared custom hooks
│   ├── 📁 stores/                   # Global state management
│   ├── 📁 types/                    # Shared TypeScript types
│   ├── 📁 utils/                    # Shared utility functions
│   └── 📁 test/                     # Test utilities & mocks
│
├── 📁 prisma/                       # Database configuration
│   └── 📄 schema.prisma             # Database schema (Users, Notes, Voice)
│
├── 📁 public/                       # Static assets
│   ├── 📄 favicon.ico               # App icon
│   └── 📄 manifest.json             # PWA manifest
│
├── 📄 .env.example                  # Environment variables template
├── 📄 package.json                  # Dependencies & scripts
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 tailwind.config.ts            # TailwindCSS configuration
└── 📄 vite.config.ts                # Vite bundler configuration
```

## 📦 Dependencies yang Terinstall

### 🎯 Core Framework
- **React Router v7** (`^7.7.1`) - File-based routing + SSR
- **React** (`^19.1.0`) - UI library
- **TypeScript** (`^5.8.3`) - Type safety
- **Vite** (`^6.3.3`) - Build tool & dev server

### 🎨 UI & Styling
- **TailwindCSS v4** (`^4.1.4`) - Utility-first CSS
- **shadcn/ui components**:
  - `class-variance-authority` (`^0.7.1`) - Component variants
  - `clsx` (`^2.1.1`) - Conditional classes
  - `tailwind-merge` (`^3.3.1`) - TailwindCSS class merging
  - `lucide-react` (`^0.544.0`) - Icons
  - `@radix-ui/react-slot` (`^1.2.3`) - Composition primitives
- **tailwindcss-animate** (`^1.0.7`) - CSS animations

### 🗄️ Database & Backend
- **Prisma** (`latest`) - Database ORM
- **@prisma/client** (`latest`) - Database client

### 🛠️ Development Tools
- **@types/node** - Node.js types
- **@types/react** - React types
- **@types/react-dom** - React DOM types
- **vite-tsconfig-paths** - Path mapping support

## 🔧 Node.js Environment

- **Minimum**: Node.js v18.0.0
- **Recommended**: Node.js v22.0.0 (current project)
- **NPM**: v8.0.0+
- **Type**: ESM (ES Modules)

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # Run TypeScript type checking

# Database
npx prisma migrate dev     # Create & apply migrations
npx prisma generate        # Generate Prisma client
npx prisma studio         # Open database GUI
npx prisma db push        # Push schema changes

# Code Quality
npm run lint         # Run ESLint (when configured)
npm run test         # Run tests (when configured)
```

## 🎨 Theme & Styling System

### Custom Colors untuk Features
```css
/* app.css */
:root {
  --notes-primary: 142 76% 36%;   /* 🟢 Green for notes */
  --voice-primary: 221 83% 53%;   /* 🔵 Blue for voice */
  --ai-primary: 271 81% 56%;      /* 🟣 Purple for AI */
  --auth-primary: 346 87% 43%;    /* 🔴 Red for auth */
}
```

### Dynamic Theme Switching
```tsx
import { applyFeatureTheme } from "~/lib/theme-utils";

// Apply feature-specific colors
applyFeatureTheme("notes"); // Switch to green theme
```

## 🗄️ Database Schema

### Models
- **User**: Authentication & profile
- **Note**: Text notes with AI summary
- **VoiceRecording**: Audio files with transcription

### Relations
- User → Notes (1:many)
- User → VoiceRecordings (1:many)
- Note → VoiceRecordings (1:many)

## 🌐 Planned Features

- ✅ **Dark/Light Theme** - Fully implemented
- ✅ **File-based Routing** - React Router v7
- ✅ **Database Schema** - Prisma + PostgreSQL
- 🔄 **Voice Recording** - In development
- 🔄 **AI Transcription** - Planned
- 🔄 **Note Management** - Planned
- 🔄 **PWA Support** - Configured, needs service worker
- 🔄 **Authentication** - Planned
- � **Real-time Sync** - Future

## 👥 Team Collaboration

### Git Workflow
1. **Feature Branch**: `git checkout -b feature/nama-feature`
2. **Development**: Code in feature-specific folders
3. **Pull Request**: Review sebelum merge ke main
4. **Database Changes**: Selalu commit migration files

### Code Organization
- **Feature-based**: Setiap feature punya folder sendiri
- **Shared Components**: Di `app/components/`
- **TypeScript**: Strict mode untuk type safety
- **Naming Convention**: kebab-case untuk files, PascalCase untuk components

### Environment Setup
```bash
# .env file (copy from .env.example)
DATABASE_URL="postgresql://user:pass@localhost:5432/notuly"
NODE_ENV="development"
OPENAI_API_KEY="your_key_here"
```

---

## 🔗 Quick Links

- **Development**: `http://localhost:3000`
- **Database Studio**: `npx prisma studio`
- **Type Checking**: `npm run typecheck`
- **Build**: `npm run build`

**Happy Coding! 🚀**
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
