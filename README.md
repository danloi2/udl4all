# 🧠 UDL Browser (Navegador DUA)

An interactive and professional explorer designed to facilitate the application of **Universal Design for Learning (UDL)** in educational environments. This tool allows navigating through the principles, guidelines, and checkpoints of the UDL 3.0 model, offering practical examples and design options for teachers.

![UDL Banner](https://img.shields.io/badge/UDL-3.0-blue?style=for-the-badge)
![Svelte](https://img.shields.io/badge/Svelte-4.0-ff3e00?style=for-the-badge&logo=svelte)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38b2ac?style=for-the-badge&logo=tailwind-css)

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

### 🖨️ High-Density PDF Optimization

Print system designed to generate professional documents:

- **Landscape Model**: The complete model compressed into a single A4 sheet with minimal margins (3mm) and maximized scale (0.98).
- **Detail Sheets**: Detailed documents that flow across multiple pages if necessary, featuring decorative icons and header protection.

### 🏗️ Data-Driven Architecture

- **Dynamic Loading**: Activities are automatically loaded from JSON files using `import.meta.glob`.
- **Flexible Structure**: Support for multiple paragraphs and optional notes in translations.

---

## 🚀 Technologies

This project is built with a modern stack focused on speed and user experience:

- **Framework**: [Svelte](https://svelte.dev/) (Vite)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconography**: [Lucide Svelte](https://lucide.dev/)
- **Routing**: `svelte-spa-router`

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

- `src/data/json/activities/`: Folder for new activity examples (in JSON format).
- `src/data/udl-core.json`: Main UDL model structure (Principles and Guidelines).
- `src/stores/udlData.ts`: Indexing and search logic.

---

## Inspiration

The organization of principles, guidelines, and considerations follows the **Universal Design for Learning (UDL)** model from [CAST UDL Guidelines™ v3.0](https://udlguidelines.cast.org/), © CAST, Inc. 2024.  
All textual content and examples are original, and the visual style has been adapted.

--- 

## 📄 License

This project is available under the MIT license. Feel free to use and adapt it for your educational needs.



## 👥 Author

**Developed by Daniel Losada**

[![GitHub](https://img.shields.io/badge/GitHub-danloi2-181717?style=for-the-badge&logo=github)](https://github.com/danloi2)
[![Researcher EHU](https://img.shields.io/badge/Researcher-EHU-blue?style=for-the-badge&logo=researchgate)](https://github.com/danloi2)

---

_Developed with ❤️ for the educational community._
