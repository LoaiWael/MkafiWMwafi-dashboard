# Mkafi W Mwafi (مكفي وموفي) — Dashboard Agent Guide

## 1. Project Overview & Business Domain

**Mkafi W Mwafi (مكفي وموفي)** is an online real estate platform specializing in certified electronic lease contracts for individuals, corporate entities, and certified real estate brokers.

This repository is the **authenticated admin / operations dashboard** (Vite + React SPA) for that platform. It is not the public marketing or customer site and is not SEO-indexable.

The public website lives in a **sibling repository**: `MkafiWMwafi` (typically `../MkafiWMwafi`, locally `C:\Loai\work\MkafiWMwafi`). That repo is a Next.js 16 App Router site (landing, contract wizard, customer auth, legal pages). Do not copy Next.js APIs (`next/image`, `'use client'`, Server Actions, `NEXT_PUBLIC_*`) from it into this dashboard. Shared product language, brand tokens, and RTL conventions should stay aligned across both apps.

### Core Purposes & Capabilities:
- **Lease Contract Certification**:
  - **Residential Contracts**: For renting and leasing apartments, villas, and family/individual dwellings (fully compatible with *Citizen Account* and *Developed Social Insurance*).
  - **Commercial Contracts**: For leasing commercial units, shops, offices, warehouses, and industrial facilities.
- **Official Regulatory Integrations & Compliance**:
  - **Ejar Network (شبكة إيجار)**
  - **Real Estate General Authority (REGA / الهيئة العامة للعقار)**
  - **Saudi Business Center (المركز السعودي للأعمال)**
- **Parties & Workflows**:
  - Facilitates agreements between lessor/seller and lessee/buyer (or authorized representatives).
  - Handles identity verification, title deed and power of attorney verification, mobile OTP authentication, commercial registers (CR), and payment terms.

---

## 2. Tech Stack

- **Bundler / app**: Vite 8 + React 19 (SPA, client-rendered). React Compiler is enabled.
- **Language**: TypeScript (strict). No `.js`. No `any`.
- **Routing**: React Router (`react-router` / `react-router-dom`) — auth vs dashboard layouts. No locale-prefixed routes.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + `tw-animate-css`. Theme tokens live in `src/index.css`.
- **UI & Animation**:
  - Base UI (`@base-ui/react`) & Shadcn-style primitives in `src/components/ui/`
  - Motion (`motion/react`) for interactive transitions
  - Lucide React (`lucide-react`) only for icons
- **State & Data**:
  - TanStack React Query (`@tanstack/react-query` v5) — all backend reads/writes
  - React Hook Form (`react-hook-form`) + `@hookform/resolvers` + Zod
- **Typography**:
  - Arabic-only RTL (`dir="rtl"`, `lang="ar"`). No i18n library, no `en` locale, no `src/messages/`.
  - Primary font: IBM Plex Sans Arabic (via `@fontsource` or CSS, not a Next.js font helper)

There is **no Next.js** in this repo: no App Router, no RSC, no `'use client'`, no Server Actions, no `next/image` / `next/font` / `next/dynamic`, no `NEXT_PUBLIC_*` env vars.

---

## 3. Project Structure & Architecture

```
├── index.html                  # SPA shell (lang/dir updated at runtime)
├── public/                     # Static assets, logos, custom icons
├── src/
│   ├── main.tsx                # createRoot + providers
│   ├── app.tsx                 # RouterProvider
│   ├── providers.tsx           # QueryClient, theme, direction
│   ├── index.css               # Tailwind v4 theme, design tokens
│   ├── routes/                 # React Router pages + layouts (thin)
│   │   ├── index.tsx           # route tree
│   │   ├── auth/               # login, forgot/reset
│   │   └── dashboard/          # authed screens
│   ├── features/               # Domain modules (components, hooks, services)
│   ├── components/
│   │   ├── ui/                 # Primitives (Button, Table, Dialog, …)
│   │   ├── animations/         # Motion wrappers
│   │   └── layout/             # DashboardShell, sidebar, navbar
│   ├── hooks/                  # Cross-feature hooks
│   └── lib/                    # api-client, env, constants, utils
└── package.json
```

- **Routes stay thin**: parse search params, compose feature components, set the document title.
- **Features own** UI, hooks, services, query keys, schemas, and types.
- Import alias `@/` maps to `src/`.

---

## 4. Design System & Theme Tokens

Theme tokens live in `src/index.css` (`:root`, `.dark`, `@theme inline`):
- Prefer semantic utilities: `bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `text-primary-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-sidebar`, `bg-chart-1`…`bg-chart-5`.
- Brand scales (when defined): `text-primary`, `bg-primary-50`, `border-primary-200`, `bg-primary-gradient`, etc.
- Layout utilities: `page-shell` (max width + horizontal padding), `full-bleed` (full-viewport breakout).

---

## 5. Development & Agent Conventions

1. **NO Hardcoded Hex Colors (Strict Rule)**:
   - **NEVER** use arbitrary hardcoded hex color values (e.g. `#00b2bd`, `text-[#00898a]`, inline hex) inside components, SVGs, or JSX.
   - **ALWAYS** use design-system tokens and semantic Tailwind classes from `src/index.css`.

2. **RTL & Arabic Only**:
   - Logical properties only (`start`/`end`, `ps`/`pe`, `ms`/`me`). See the `rtl` rule.
   - Formal, gender-neutral Arabic copy. Do not add `react-i18next`, locale routes, or `en` message files.

3. **Client SPA — no Server Components**:
   - Every React component runs in the browser. Do not add `'use client'`, `async` page components, or Server Actions.
   - Data fetching is React Query in the browser. Mutations are `useMutation` → `lib/api-client`.

4. **Feature-Sliced Organization**:
   - Feature logic lives in `src/features/<feature-name>/`.
   - Cross-cutting UI lives in `src/components/ui/` or `src/components/layout/`.

5. **React Compiler & No Manual Memoization (Strict Rule)**:
   - **DO NOT** use `useMemo`, `useCallback`, or `React.memo`.
   - The React Compiler (`babel-plugin-react-compiler`) is enabled and automatically handles all memoization across the codebase. Write idiomatic, clean React code with direct variable assignments and standard functions.

6. **Type Safety & Validation**:
   - Strict TypeScript. Regular `function Name()` syntax for components and services.
   - Forms: Zod + react-hook-form. API responses: TypeScript interfaces from real payloads (check-before-type).

7. **Environment**:
   - Vite client vars are `VITE_*`, read only through `src/lib/env.ts` (`import.meta.env`). Never `process.env` in app code.

8. **Key Commands**:
   - `npm run dev`: Vite dev server
   - `npm run build`: `tsc -b && vite build`
   - `npm run preview`: preview the production bundle
   - `npm run lint`: ESLint
