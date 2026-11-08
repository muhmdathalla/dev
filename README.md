# Muhammad Athalla Bagaskara — Frontend & Systems Engineering Portfolio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-muhmdathalla.github.io%2Fdev-black?style=for-the-badge&logo=githubpages&logoColor=white)](https://muhmdathalla.github.io/dev/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6%20Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-white?style=for-the-badge)](LICENSE)

> Production-grade personal portfolio and frontend engineering showcase engineered by **Muhammad Athalla Bagaskara (alDev)**. Built with React 18, Strict TypeScript, Modern CSS Custom Properties, and live telemetry pipelines with zero layout shift.

---

## ⚡ Live Platform

- **Production Deployment**: [https://muhmdathalla.github.io/dev/](https://muhmdathalla.github.io/dev/)
- **Target Roles**: Frontend Engineer (React/TypeScript), Full-Stack Web Developer, Systems & Developer Tools Engineer

---

## 🛠️ Architectural & Technical Highlights

### 1. Strict TypeScript & React 18 Component Architecture
- **Typed Domain Contracts (`src/types/portfolio.ts`)**: Comprehensive interface definitions (`ProjectContribution`, `MarketTelemetryState`, `WeatherTelemetryState`) with strict type safety and zero `any` declarations.
- **Custom React Hooks (`src/hooks/useMarketTelemetry.ts`)**: Resilient polling hook managing real-time market telemetry (USD/IDR currency rates and IDX IHSG market fluctuations) with automatic fallback recovery.
- **Frontend Contribution Showcase (`src/components/FrontendShowcase.tsx`)**: Modular React component presenting substantive commits, architecture summaries, and formatted application text ready for recruiter assessment.

### 2. Dual-Theme Engine (Strict Monochrome B&W)
- **Zero-FOUC Instant Initialization**: Pre-render theme resolver in document `<head>` synchronizing with system color scheme (`prefers-color-scheme`) and `localStorage` before stylesheet evaluation.
- **High-Contrast WCAG 2.1 AA Compliance**: Strict monochrome design tokens guaranteeing $\ge 4.5:1$ text-to-surface contrast ratio across both Dark (`#060608`) and Light (`#ffffff`) surfaces.

### 3. Real-Time Telemetry & Weather Art Engine
- **Live Market Telemetry**: Asynchronous fetching from ExchangeRate API and IDX index simulation with real-time green/red tick-bounce CSS flash indicators (`@keyframes tickFlashUp` / `tickFlashDown`).
- **Interactive Weather Art**: Geolocation and reverse-geocoded Open-Meteo API integration rendering multi-state animated CSS scenes (pulsing sun with geometric ray rotation, multi-layered cloud drift, and cascading rain streaks).

### 4. iOS Liquid Glassmorphism & 3D Micro-Tilt Physics
- **Layered Frosted Glass Surfaces**: `backdrop-filter: blur(24px) saturate(180%)` paired with subtle specular highlights (`inset 0 1px 1px`) and elevation shadows.
- **Hardware-Accelerated 3D Card Tilt**: Mouse vector physics computing real-time perspective rotations on desktop cards without CPU frame drops.
- **Liquid Sheen Sweep**: Specular reflection sweep animations on interactive controls and CTA buttons.

---

## 📁 Repository Structure

```text
├── docs/                   # Production deployment assets (GitHub Pages root)
│   ├── index.html          # Semantic HTML5 document with security & SEO metadata
│   ├── style.css           # Modern CSS Custom Properties & liquid glass animations
│   ├── script.js           # Core client-side telemetry, theme switcher & tilt physics
│   ├── react-showcase.js   # Compiled React 18 & TypeScript Showcase component
│   └── .nojekyll           # GitHub Pages raw asset pass-through
├── src/                    # Source TypeScript & React application layer
│   ├── components/         # Modular React components
│   │   └── FrontendShowcase.tsx
│   ├── hooks/              # Custom React telemetry hooks
│   │   └── useMarketTelemetry.ts
│   ├── types/              # Strict TypeScript domain interfaces
│   │   └── portfolio.ts
│   └── index.tsx           # Application mount entrypoint
├── package.json            # Project dependencies & npm scripts
├── tsconfig.json           # Strict TypeScript compiler configuration
└── README.md               # Technical documentation & project guide
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation & Type Checking

1. **Clone the repository:**
   ```bash
   git clone https://github.com/muhmdathalla/dev.git
   cd dev
   ```

2. **Install development dependencies:**
   ```bash
   npm install
   ```

3. **Run TypeScript compiler check (Strict mode):**
   ```bash
   npm run typecheck
   ```

4. **Launch local development server:**
   ```bash
   npx serve docs
   ```
   Open `http://localhost:3000` in your browser.

---

## 💼 Core Projects & Substantive Contributions

| Project | Role | Tech Stack | Architectural Highlights |
| :--- | :--- | :--- | :--- |
| **[NativeCopy](https://github.com/muhmdathalla/nativecopy)** | Creator & Maintainer | TypeScript, Python, VS Code Extension API, SSE, MediaPipe AI | Low-latency cross-device clipboard bridge with live code buffer injection and touchless computer vision cursor controls. |
| **[SPADA Auto-Presence](https://github.com/muhmdathalla/dev)** | Lead Developer | Python, Playwright, Telegram Bot API, GitHub Actions | Zero-maintenance automated academic attendance pipeline with cloud cron execution and real-time verification proofs. |
| **International Client Contracts** | Contract Developer | React, TypeScript, Next.js, Tailwind CSS, Shopify CMS | Delivered responsive high-conversion ecommerce flows and database administration for clients in New York (USA) and Singapore. |

---

## 📬 Contact & Connect

- **Engineer**: Muhammad Athalla Bagaskara (alDev)
- **Email**: [iamathaalla@gmail.com](mailto:iamathaalla@gmail.com)
- **GitHub**: [@muhmdathalla](https://github.com/muhmdathalla)
- **Institution**: Undergraduate in Computer Science at UPN "Veteran" Yogyakarta

---

## 📄 License

This repository is distributed under the [MIT License](LICENSE).
