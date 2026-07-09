# 📌 PinPoint Pro

> **The Open-Source "Invincible UI" Window Manager & Productivity Surface.**

PinPoint Pro is a high-performance, context-aware digital workspace designed for deep work. It transforms your browser or desktop environment into a "pinned" productivity surface, using AI to intelligently manage window layouts, categorise research, and provide semantic search across your entire workspace.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version: 1.0.0-beta](https://img.shields.io/badge/Version-1.0.0--beta-green)
![AI: Provider Agnostic](https://img.shields.io/badge/AI-Provider%20Agnostic-blueviolet)
![Preferred: Azure OpenAI](https://img.shields.io/badge/Preferred-Azure%20OpenAI-0078D4?logo=microsoft-azure)

---

## ✨ Key Features

### 🪟 Advanced Window Management
- **Smart Pinning**: Pin any window to stay on top of your workflow.
- **Ghosting Mode**: Inactive pinned windows become translucent and grayscale, reducing peripheral distractions while maintaining visibility.
- **Desktop Folders**: Drag and drop windows onto each other to create smart stacks and categorised folders.
- **Multi-Tab Surfaces**: Browser windows feature a deeply integrated tab architecture, allowing multiple web resources to coexist in a single pinned surface.

### 🤖 AI-Powered Intelligence
PinPoint Pro is designed to work with **any AI provider**. We recommend [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service) as the preferred provider, but you can plug in any OpenAI-compatible API.

- **Ghost Search (⌘K)**: A semantic search engine that understands the *content* of your open windows. Ask "Find that research about LLMs," and PinPoint Pro will highlight the relevant window.
- **Tab Ingestion**: The Smart Assistant can "sync" your external browser tabs, summarising them and arranging them into logical workspace layouts.
- **Layout Orchestration**: Use natural language to tell the Assistant how you want to work (e.g., "Set up my screen for a deep coding session").

### 🧘 Focus & Zen
- **Focus Timer**: Built-in Pomodoro cycles with "Focus" and "Break" modes.
- **Aura Pulse**: Pinned windows pulse softly with your accent colour when the focus timer is active.
- **Zen Mode**: One-click UI dimming that fades out non-essential windows, leaving only your pinned focus tasks visible.
- **Focus Soundscapes**: Procedural ambient noise (Nature, Lo-Fi, Deep Ambient) to drown out distractions.

---

## 🎨 Design Philosophy: "The Invincible UI"

PinPoint Pro follows the **Invincible UI** framework:
- **Glassmorphism**: High-blur, translucent surfaces that maintain spatial awareness of the background.
- **Mesh Gradients**: Procedural, flowing backgrounds that shift based on your active "Colour Theme" (Nebula, Sunrise, Ocean, Emerald).
- **Responsive Motion**: 0.4s cubic-bezier transitions for all window movements, ensuring the interface feels organic and lightweight.

---

## 🛠 Tech Stack

- **Framework**: React 19 (ES6 Modules)
- **Styling**: Tailwind CSS
- **AI Engine**: Provider-agnostic — bring your own API key. Recommended: [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)
- **Icons/Graphics**: Custom CSS Glassmorphism + Lucide-inspired iconography.

---

## 🚀 Getting Started

### Prerequisites
- An API key from your chosen AI provider. We recommend **Azure OpenAI** — sign up at [azure.microsoft.com](https://azure.microsoft.com/en-us/products/ai-services/openai-service).
- A modern browser with ES6 module support (such as the latest versions of Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).

### Supported AI Providers
PinPoint Pro works with any OpenAI-compatible API. Set the following environment variables:

| Variable | Description |
|---|---|
| `API_KEY` | Your AI provider API key |
| `API_BASE_URL` | API base URL (optional — defaults to Azure OpenAI endpoint) |
| `API_MODEL` | Model name (e.g. `gpt-4o`, `gpt-4-turbo`) |

**Recommended (Azure OpenAI):**
```env
API_KEY=your_azure_openai_key_here
API_BASE_URL=https://YOUR_RESOURCE.openai.azure.com/
API_MODEL=gpt-4o
```

**Other compatible providers** (any OpenAI-compatible API):
```env
API_KEY=your_key_here
API_BASE_URL=https://api.your-provider.com/v1
API_MODEL=your-model-name
```

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/raphgm/pinpointpro.git
   cd pinpointpro
   ```
2. Set up your environment variables in a `.env` file (see above).
3. Serve the directory:
   ```bash
   npx serve .
   ```

---

## 📂 Project Structure

```text
├── index.html          # Entry point & Global Styles
├── index.tsx           # React Mount
├── App.tsx             # Main Logic & State Orchestration
├── types.ts            # TypeScript Definitions
├── components/         # Atomic UI Components
│   ├── StatusBar.tsx   # Global Control Bar
│   ├── Window.tsx      # The "Surface" Component
│   ├── Desktop.tsx     # The Infinite Workspace
│   └── ...             # Assistant, Search, etc.
└── metadata.json       # Project Metadata
```

---

## 🤝 Contributing

PinPoint Pro is a community-first open-source project — we welcome contributors of all levels. Whether you are fixing a bug, improving docs, or adding a feature, your contribution matters.

1. **Fork** the repo on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pinpointpro.git
   cd pinpointpro
   ```
3. **Add upstream** remote so you can sync with the latest changes:
   ```bash
   git remote add upstream https://github.com/raphgm/pinpointpro.git
   ```
4. **Sync** before branching:
   ```bash
   git fetch upstream && git checkout main && git merge upstream/main
   ```
5. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-name-description
   ```
6. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(ui): add amazing feature"
   ```
7. **Push** and open a Pull Request targeting `main`:
   ```bash
   git push -u origin feature/your-name-description
   ```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

Built with ❤️ by the PinPoint Community. Stay focused. Stay invincible.

PinPoint is a great community where you learn, relearn and have opportunity of being in a great Team.
