# 🧠 udl4all (UDL Browser)

![UDL Banner](https://img.shields.io/badge/UDL-3.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38b2ac?style=for-the-badge&logo=tailwind-css)
![Remotion](https://img.shields.io/badge/Remotion-4.0-blueviolet?style=for-the-badge&logo=remotion)

An interactive and professional explorer designed to facilitate the application of **Universal Design for Learning (UDL)** in educational environments. This tool allows navigating through the principles, guidelines, and checkpoints of the UDL 3.0 model, offering practical examples and design options for teachers.

---

## ✨ Key Features

### 🌍 Multilingual by Default

Full support for 4 simultaneous languages, allowing language switching on the fly without losing context:

- **Spanish (es)**
- **English (en)**
- **Basque (eu)**
- **Latin (la)**

### 📖 Complete Interactive Model

- **Network Visualization**: Powered by `@xyflow/react` for a clear representation of Affective, Recognition, and Strategic networks.
- **Professional Hierarchy**: Fluid navigation from Principles to individual Considerations.
- **Activity Bank**: Integration of real-world examples based on curricular activities.
- **Interactive Web Tools**: Support for external tools (GeoGebra, Padlet, etc.) integrated into UDL adaptations.

### 🎬 Video Generation

Integrated with **Remotion** to generate explanatory video content for UDL guidelines:

- **Studio Mode**: Preview and refine video compositions.
- **Automated Rendering**: Scripts for batch rendering videos in all supported languages.

### 🖨️ High-Density PDF Optimization

Print system designed to generate professional documents:

- **Landscape Model**: The complete model compressed into a single A4 sheet.
- **Detail Sheets**: Detailed documents that flow across multiple pages with header protection.

---

## 🚀 Technologies

This project is built with a modern stack prioritized for speed and accessibility:

- **Framework**: [React 18](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
- **Graph Engine**: [@xyflow/react](https://reactflow.dev/) (formerly React Flow)
- **Search**: [Fuse.js](https://www.fusejs.io/) for high-speed fuzzy searching.
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: `react-router-dom` (HashRouter for simplified static hosting)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Video Rendering**: [Remotion](https://www.remotion.dev/)

---

## 🛠️ Installation and Development

1. **Clone the repository**:

   ```bash
   git clone https://github.com/danloi2/udl4all.git
   cd udl4all
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run in development mode**:

   ```bash
   npm run dev
   ```

4. **Video Generation (Remotion)**:
   ```bash
   # Start Remotion Studio
   npm run video:studio
   # Render all videos
   npm run video:render
   ```

---

## 📂 Data & Structure

- `src/data/json/activities/`: Centralized folder for activity examples (JSON).
- `src/data/json/udl-core.json`: Main UDL 3.0 model structure.
- `video/`: Remotion project for automated video content creation.
- `scripts/`: Utility scripts for data generation and sync.

### 📝 Adding New Activities

To add a new activity, simply create a JSON file in `src/data/json/activities/` following the established schema. The application uses `import.meta.glob` to automatically index and load new content.

---

## 🙏 Credits & Inspiration

- **UDL Model**: The organization follows the **Universal Design for Learning (UDL)** model from [CAST UDL Guidelines™ v3.0](https://udlguidelines.cast.org/), © CAST, Inc. 2024.
- **ROMCAL**: This project utilizes [ROMCAL](https://github.com/romcal/romcal) for specialized liturgical and calendar data integration.

---

## 📄 License

MIT License - Copyright (c) 2026 Daniel Losada.

## 👥 Author

### Developed by Daniel Losada

[![GitHub](https://img.shields.io/badge/GitHub-danloi2-181717?style=for-the-badge&logo=github)](https://github.com/danloi2)
