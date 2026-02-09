# 🧠 UDL Browser

![UDL Banner](https://img.shields.io/badge/UDL-3.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38b2ac?style=for-the-badge&logo=tailwind-css)
![Radix UI](https://img.shields.io/badge/Radix_UI-1.0-6e56cf?style=for-the-badge&logo=radix-ui)

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

- **Network Visualization**: Clear representation of Affective, Recognition, and Strategic networks.
- **Professional Hierarchy**: Fluid navigation from Principles to specific Considerations.
- **Activity Bank**: Integration of real-world examples based on curricular activities (Math, etc.).
- **Interactive Web Tools**: Support for external tools (GeoGebra, Padlet, etc.) integrated into UDL adaptations.

### 🖨️ High-Density PDF Optimization

Print system designed to generate professional documents:

- **Landscape Model**: The complete model compressed into a single A4 sheet.
- **Detail Sheets**: Detailed documents that flow across multiple pages with header protection.

### 🏗️ Data-Driven Architecture

- **Dynamic Loading**: Activities are automatically loaded using `import.meta.glob`.
- **Flexible Structure**: Ported from Svelte to React with specialized Context Providers for performance.

---

## 🚀 Technologies

This project is built with a modern stack prioritized for speed and accessibility:

- **Framework**: [React 18](https://reactjs.org/) (Vite)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: `react-router-dom` (HashRouter)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🛠️ Installation and Development

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-user/udl-browser.git
   cd udl-browser
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run in development mode**:

   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Data Organization

Model and activity data are centralized for easy editing:

- `src/data/json/activities/`: Folder for new activity examples (JSON).
- `src/data/json/udl-core.json`: Main UDL model structure.
- `src/contexts/UDLDataContext.tsx`: Indexing and search logic using React Context.

---

## Inspiration

The organization of principles, guidelines, and considerations follows the **Universal Design for Learning (UDL)** model from [CAST UDL Guidelines™ v3.0](https://udlguidelines.cast.org/), © CAST, Inc. 2024.

---

## 📄 License

MIT License.

## 👥 Author

### Developed by Daniel Losada

[![GitHub](https://img.shields.io/badge/GitHub-danloi2-181717?style=for-the-badge&logo=github)](https://github.com/danloi2)
