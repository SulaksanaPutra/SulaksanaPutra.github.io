# Sulaksana Putra — Personal Website

A modern, high-performance personal portfolio and technical blog built with **Vue 3**, **TypeScript**, and **Vite**. This project serves as a digital garden, showcasing professional case studies, technical writings, and specialized skills.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/Vue.js-3.x-4fc08d?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.x-646cff?logo=vite)

---

## 🚀 Live Demo
**[View the live site here](https://sulaksanaputra.github.io/personal-website/)**

---

## ✨ Key Features

- **🌑 Theme-Aware Design**: Full support for Dark and Light modes with custom-tailored aesthetics.
- **🌍 Internationalization (i18n)**: Multi-language support with graceful fallback mechanisms for missing translations.
- **✍️ Case Studies & Writings**: Structured modules for documented projects and technical articles.
- **🧠 System Overview**: A dedicated glossary and systems view to explain tools and workflows.
- **⚡ Performance First**: Optimized build using Vite, with a focus on fast load times and clean SEO.
- **🛠 Development Plugins**: Custom Vite plugin for saving article drafts directly from the browser during development.

---

## 🛠 Tech Stack

- **Core**: [Vue 3](https://vuejs.org/) (Composition API)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **Utilities**: [VueUse](https://vueuse.org/)
- **Testing**: [Vitest](https://vitest.dev/) (Unit) & [Playwright](https://playwright.dev/) (E2E)
- **Deployment**: [GitHub Actions](https://github.com/features/actions)

---

## 📂 Project Structure

```text
src/
├── core/           # Shared composables, services, and types
├── modules/        # Domain-driven modules
│   ├── case-studies/
│   ├── writings/
│   ├── skills/
│   ├── home/       # Home page components and state
│   └── chat/       # Interactive components
├── router/         # Application routing logic
└── assets/         # Global styles and static assets
```

---

## ⚙️ Development Setup

### 1. Installation
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```

### 3. Build & Production Preview
```bash
npm run build
npm run preview
```

### 4. Testing
- **Unit Tests**: `npm run test:unit`
- **E2E Tests**: `npm run test:e2e`

---

## 🚢 Deployment

This project is configured for **GitHub Pages** via GitHub Actions.

1.  Push your changes to the `main` branch.
2.  The `vite.config.ts` is configured with `base: '/personal-website/'`.
3.  GitHub Actions will automatically build and deploy the site.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
