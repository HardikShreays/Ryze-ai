# Ryze AI

<p align="center">
  <strong>Deterministic AI-Powered UI Generator</strong>
</p>

<p align="center">
  <a href="https://github.com/Hardikshreays/Ryze-ai">
    <img src="https://img.shields.io/badge/GitHub-Ryze--ai-181717?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js" alt="Next.js" />
  </a>
  <a href="https://expressjs.com">
    <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express" alt="Express" />
  </a>
  <a href="https://openrouter.ai">
    <img src="https://img.shields.io/badge/OpenRouter-LLM-412991?style=for-the-badge" alt="OpenRouter" />
  </a>
</p>

---

A structured multi-step AI agent pipeline that generates React UIs from plain English descriptions. Uses a fixed, deterministic component library to ensure predictable and reproducible output.

![Architecture](https://img.shields.io/badge/Architecture-Multi--Agent_Pipeline-blue?style=flat-square)

## ✨ Features

- **Natural language to UI** – Describe your interface in plain English
- **Live preview** – See generated UIs render in real time
- **Iterative editing** – Refine designs via chat with Regenerate
- **Version history** – Roll back to any previous version
- **Explainable decisions** – Understand layout and component choices
- **Deterministic** – Fixed component library, no arbitrary code generation

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js)                              │
│  ┌─────────────┐  ┌─────────────────┐  ┌──────────────────────────────┐ │
│  │ Chat Panel  │  │ Generated Code  │  │ Live Preview (Plan Renderer)  │ │
│  │ Generate    │  │ (Editable)      │  │                               │ │
│  │ Regenerate  │  │                 │  │ Deterministic, no eval        │ │
│  │ Rollback    │  │                 │  │                               │ │
│  └──────┬──────┘  └────────┬────────┘  └──────────────────────────────┘ │
└─────────┼──────────────────┼───────────────────────────────────────────┘
          │                  │
          │  axios            │
          ▼                  │
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (Express)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Planner    │─▶│  Validator   │─▶│  Generator   │─▶│  Explainer   │  │
│  │  (JSON)     │  │  (Schema)    │  │  (JSX)       │  │  (English)   │  │
│  └──────┬──────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                                                                  │
│         └──────────────────────▶ OpenRouter API (LLM)                     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Agent Pipeline

| Stage | Input | Output |
|-------|-------|--------|
| **Planner** | User intent, optional previous plan | Structured JSON plan |
| **Validator** | Plan | Valid plan or schema errors |
| **Generator** | Valid plan | React JSX code |
| **Explainer** | Plan + optional previous | Plain English rationale |

## 🧩 Component Library

All UI is built from a fixed set of components. The AI may only set props—no inline styles, no custom CSS, no new components.

| Component | Key Props |
|-----------|-----------|
| Button | `variant`, `label`, `onClick` |
| Card | `title`, `description`, `children` |
| Input | `label`, `placeholder`, `value`, `type` |
| Table | `columns`, `rows` |
| Modal | `title`, `open`, `onClose` |
| Sidebar | `title`, `items`, `children` |
| Navbar | `title`, `subtitle` |
| Chart | `dataKey`, `title` |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [OpenRouter API key](https://openrouter.ai/keys)

### 1. Clone the repository

```bash
git clone https://github.com/Hardikshreays/Ryze-ai.git
cd Ryze-ai
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-4o-mini   # optional
```

Start the backend:

```bash
npm run dev
```

Listens on **http://localhost:2001**

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `.env.local` (optional, defaults to backend at `http://127.0.0.1:2001`):

```env
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:2001
```

Start the frontend:

```bash
npm run dev
```

Open **http://localhost:3000**

## 📁 Project Structure

```
Ryze-ai/
├── backend/                 # Express API + Agent pipeline
│   ├── src/
│   │   ├── agent/          # Planner, Generator, Explainer, Validator
│   │   ├── index.ts        # Express server
│   │   └── types.ts
│   └── package.json
├── frontend/               # Next.js app
│   ├── src/
│   │   ├── app/           # Pages, API proxy, layout
│   │   ├── components/ui/ # Deterministic component library
│   │   └── lib/           # API client, plan renderer, types
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS |
| Backend | Express, TypeScript |
| LLM | OpenRouter (OpenAI-compatible API) |
| Client | Axios |

## 📜 License

MIT

---

<p align="center">
  <strong>Ryze AI</strong> by <a href="https://github.com/Hardikshreays">Hardikshreays</a>
</p>
