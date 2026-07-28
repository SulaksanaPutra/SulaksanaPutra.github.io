# Bayu Aksana — Personal Website

> Welcome to my personal website and digital garden. This is a space where I share my software engineering projects, case studies, technical write-ups, and thoughts on building reliable systems.

---

## Live Site

- **Website:** [bayuaksana.com](https://bayuaksana.com/)

---

## Features

- **Theme-Aware Design:** Full support for dark and light modes with custom-tailored aesthetics.
- **Internationalization (i18n):** Multi-language support with fallback handling for missing keys.
- **Case Studies & Writings:** Structured modules for documented projects and technical articles.
- **System Overview:** Dedicated glossary and systems view detailing tools and workflows.
- **Performance First:** Optimized build output using Vite with focus on fast Core Web Vitals and SEO.
- **Development Plugins:** Custom Vite plugin for persisting article drafts directly during development.

---

## Tech Stack

- **Core Framework:** [Vue 3](https://vuejs.org/) (Composition API)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **Iconography:** [Lucide Vue Next](https://lucide.dev/)
- **Utilities:** [VueUse](https://vueuse.org/)
- **Testing:** [Vitest](https://vitest.dev/) (Unit) & [Playwright](https://playwright.dev/) (E2E)
- **Deployment:** [GitHub Actions](https://github.com/features/actions)

---

## Project Structure

```text
.
├── .github/            # GitHub Actions CI/CD workflows
├── public/             # Static public assets and favicon assets
├── scripts/            # Automation scripts (prerender, sitemap, image optimization)
├── src/                # Application source code
│   ├── assets/         # Global stylesheets and static design assets
│   ├── core/           # Shared composables, services, utilities, and types
│   ├── games/          # Interactive mini-games and canvas widgets
│   ├── modules/        # Domain-driven feature modules
│   │   ├── case-studies/ # Portfolio case studies & articles
│   │   ├── chat/         # Interactive components & state
│   │   ├── contact/      # Contact module & touchpoints
│   │   ├── home/         # Landing page components & state
│   │   ├── projects/     # Project showcase modules
│   │   ├── skills/       # Skills overview & interactive matrix
│   │   ├── systems/      # System overview & technical glossary
│   │   └── writings/     # Technical articles & blog posts
│   ├── router/         # Vue Router navigation & route definitions
│   ├── App.vue         # Root application layout component
│   └── main.ts         # Application entry point
├── tests/              # Vitest unit tests & Playwright E2E test suites
├── Dockerfile          # Multi-stage production container build specification
├── docker-compose.yml  # Docker Compose service definitions (web & dev)
├── nginx.conf          # Production Nginx SPA fallback configuration
├── package.json        # Dependencies, scripts, and project metadata
└── vite.config.ts      # Vite configuration & dev server plugins
```

---

## Development Setup

You can run, build, and test this project locally using either **NPM** or **Docker**.

### Option A: Local Setup (NPM)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Access the dev server at `http://localhost:5173`.

3. **Build & Preview Production:**
   ```bash
   npm run build
   npm run preview
   ```

4. **Testing:**
   - **Unit Tests:** `npm run test:unit`
   - **E2E Tests:** `npm run test:e2e`

---

### Option B: Containerized Setup (Docker)

1. **Production Container (Nginx):**
   ```bash
   docker compose up web --build
   ```
   Access the production container at `http://localhost:8080`.

2. **Development Container (HMR):**
   ```bash
   docker compose up dev
   ```
   Access the hot-reloading dev container at `http://localhost:5173`.

---

## Deployment

Automated via GitHub Actions targeting custom domain host `bayuaksana.com`.

1. Push updates to the `main` branch.
2. GitHub Actions runner compiles production assets via `npm run build`.
3. Deployment pipeline deploys static assets to root host.

---

## Developer & Contact

- **Developer:** [Bayu Aksana](https://bayuaksana.com/)
- **Website:** [bayuaksana.com](https://bayuaksana.com/)
- **Email:** [info@bayuaksana.com](mailto:info@bayuaksana.com)
- **GitHub Profile:** [github.com/SulaksanaPutra](https://github.com/SulaksanaPutra)

---

## License

[MIT License](LICENSE) © 2026 Bayu Aksana
