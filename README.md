# 🧠 udl4all (UDL Browser) v3.0

![UDL Banner](https://img.shields.io/badge/UDL-3.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38b2ac?style=for-the-badge&logo=tailwind-css)
![Remotion](https://img.shields.io/badge/Remotion-4.0-blueviolet?style=for-the-badge&logo=remotion)

An advanced, interactive explorer designed to facilitate the implementation of **Universal Design for Learning (UDL)** in educational environments. This professional tool allows teachers to navigate through the complex hierarchy of the **UDL 3.0 model**, providing contextual adaptations, practical activities, and design options.

---

## 🏗️ Technical Architecture

The application is built as a high-performance **Single Page Application (SPA)** using React and Vite, with a heavy emphasis on data-driven modularity.

### 🧩 Core State Management

The system utilizes specialized **React Context Providers** to manage global state without the overhead of external libraries:

- **`UDLDataContext`**: The "brain" of the app. It handles the dynamic loading of JSON activities, builds a searchable index in-memory at runtime, and provides optimized lookup methods (`getConsiderationById`, etc.).
- **`SearchContext`**: Powered by **Fuse.js**, it implements a high-speed fuzzy search engine that indexes principles, guidelines, considerations, and activities dynamically.
- **`UIContext`**: Manages interaction states, such as panel visibility and layout preferences.
- **`LanguageContext`**: Facilitates instant switching between **Spanish, English, Basque, and Latin** across the entire UI.

### 📊 Visualization & Interaction

- **Interactive Concept Maps**: Uses **`@xyflow/react`** (React Flow) to render the UDL networks as interactive nodes and edges, allowing visual exploration of the relationships between principles.
- **Responsive Layout**: Designed for both desktop and mobile, with a focus on "High-Density" information display.
- **Flash-Fast Navigation**: Uses `HashRouter` for zero-latency transitions and easy deployment on static hosts like GitHub Pages.

---

## 🎬 Video Generation Pipeline

A unique feature of **udl4all** is its integrated video creation engine located in the `video/` directory, built on **Remotion**.

- **Programmatic Video**: Guideline explanations are rendered as videos using React components.
- **Multilingual Renders**: Automated scripts generate synchronized videos in all 4 supported languages.
- **Batch Processing**:

  ```bash
  # Preview and refine compositions
  npm run video:studio
  # Render all 52 specialized videos
  npm run video:render
  ```

---

## 📂 Project Structure & Data Flow

```text
├── src/
│   ├── components/       # Atomic and complex UI components (Breadcrumbs, FloatingNav)
│   ├── contexts/         # State management and data indexing logic
│   ├── data/
│   │   ├── json/         # Centralized data store
│   │   │   ├── activities/ # Auto-indexed activity bank
│   │   │   └── udl-core.json # Main UDL 3.0 hierarchy
│   ├── routes/           # Page containers (Explorer, Model, Videos, etc.)
│   └── utils/            # Shared logic and formatting helpers
├── video/                # Independent Remotion project for video assets
├── scripts/              # Internal maintenance and automation tools
└── public/               # Static assets (favicons, metadata) served at the root
```

### 📁 Asset Management

To ensure clarity and performance, the project distinguishes between two types of assets:

- **`public/` folder**: Use this for files that must keep their names and be served from the root (`/`).
  - **Favicons**: `logo.png` is served at `/logo.png` for headers and browsers.
  - **Metadata**: Files like `version.json` used by scripts.
  - **Note**: Files here are copied as-is to the `dist` folder.
- **`src/assets/` folder**: Use this for images or fonts used within your React components via `import`.
  - Vite will process, optimize, and version these files (e.g., adding a hash to the filename) during the build.

### 📝 Dynamic Activity Loading

Activities are NOT hardcoded. The application uses Vite's `import.meta.glob` to scan the `src/data/json/activities/` folder at build time. To add new content, simply drop a validated JSON file in that directory.

---

## 🛠️ Internal Tooling

The project includes custom-built maintenance scripts:

- **`generate-activities.mjs`**: Standardizes the creation of JSON activity files from Markdown sources.
- **`sync-version.mjs`**: Automatically synchronizes project versions across `package.json`, `udl-core.json`, and the public metadata.
- **`verify_activity.js`**: A validation utility to ensure all JSON data matches the expected UDL schemas.

---

## 🚀 Deployment & Installation

1. **Setup**:

   ```bash
   git clone https://github.com/danloi2/udl4all.git
   npm install
   ```

2. **Development**:

   ```bash
   npm run dev
   ```

3. **Build**:
   ```bash
   npm run build # Generates optimized static build in /dist
   ```

---

## 🙏 Credits & Inspiration

- **UDL Framework**: Based on the **Universal Design for Learning (UDL)** model from [CAST UDL Guidelines™ v3.0](https://udlguidelines.cast.org/), © CAST, Inc. 2024.
- **Icons & UI**: [Lucide React](https://lucide.dev/) and [Radix UI](https://www.radix-ui.com/).

---

## 📄 License & Author

**MIT License** - Copyright (c) 2026 **Daniel Losada**.

[![GitHub](https://img.shields.io/badge/GitHub-danloi2-181717?style=for-the-badge&logo=github)](https://github.com/danloi2)
