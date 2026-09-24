---
name: create-ui-section-or-page
description: Guide and standard workflow for creating UI pages or sections using the page-shell utility class, semantic design tokens, shadcn tooltips on UI icons, missing/custom icon verification in public/icons, React Router pages in this Vite SPA, viewTransition on Link/NavLink/Form/navigate, and writing formal gender-neutral i18n copy.
---

# Create UI Section or Page Skill

This skill provides step-by-step instructions and architectural patterns for creating UI pages or sections across the dashboard.

Related skills (load when relevant):

- `animations` — viewport scroll reveals, stagger effects, motion wrappers, and interactive animations
- `create-loading-skeletons` — pixel-perfect Suspense / `isLoading` skeletons
- `document-meta` — per-route `document.title`, `html` lang/dir, noindex
- `wire-api` — connecting the page to backend data via React Query

## Core Architectural Principles

1. **Vite + React SPA (no RSC)**:
   - Route pages live under `src/routes/auth/` or `src/routes/dashboard/` and are regular React function components — **not** async Server Components and **not** `'use client'`.
   - Pages stay thin: compose feature sections, read search params, set the document title (`document-meta` skill).
   - Isolate animations into `@/components/animations` wrappers (`animations` skill).

2. **Page Width & Padding with `@utility page-shell`**:
   - Use the `page-shell` Tailwind utility class directly on wrapping container `<div>` or `<section>` tags.
   - It automatically enforces `max-width: var(--page-max-width)`, centered margins (`margin-inline: auto`), and responsive horizontal padding (`px-4 sm:px-6 lg:px-8`).
   - For full-width elements that break out of boundaries (e.g. banners), use the `@utility full-bleed` class.

3. **Color & Semantic Design Tokens**:
   - Strictly use semantic color tokens (`bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `text-primary-foreground`, `border-border`, `text-muted-foreground`, etc.).
   - Avoid hardcoded arbitrary hex colors in Tailwind classes.

4. **i18n & Localization**:
   - Use `useTranslation()` from `react-i18next`. Update keys in both `src/messages/ar.json` and `src/messages/en.json`.
   - **Formal, gender-neutral address**: UI copy speaks to an unknown operator who may be a man or a woman. Prefer formal tone; never assume feminine (or masculine-only) second-person forms.
     - **Arabic (`ar`)**: Avoid feminine-only imperatives (تتبعي، أضيفي، احذفي). Prefer impersonal / verbal-noun CTAs (تتبع الطلبات، إضافة مستخدم) or neutral noun phrases.
     - **English (`en`)**: Neutral formal phrasing ("Add a user", "Track contracts").
     - Apply this to CTAs, empty states, toasts, tooltips, `aria-label`s, and any new or edited message strings.

5. **Tooltips on Small UI Icons & Icon Actions (Accessibility & Clarity)**:
   - Whenever a small icon, icon-only button, badge, or interactive control appears:
     - Wrap it with shadcn **Tooltip** from `@/components/ui/tooltip`.
     - Provide localized text inside `<TooltipContent>` and an `aria-label` on the trigger.
     - Placement: `side="top" | "bottom" | "inline-start" | "inline-end"`, `sideOffset={6}`.

6. **Custom & Missing UI Icons**:
   - First check `lucide-react`.
   - If missing, check `public/icons/`.
   - If still missing, **ask the user** for the exact file name/path before inventing an icon.

7. **View Transitions on every in-app navigation**:
   - Enable the View Transitions API on every React Router navigation. This app uses `createBrowserRouter` (data mode), so the option is supported. Unsupported browsers skip the animation.
   - Add the boolean `viewTransition` prop to `Link`, `NavLink`, and `Form`.
   - Pass `{ viewTransition: true }` to `useNavigate()` / `navigate()`.
   - When composing via a primitive `render` prop (`SidebarMenuButton`, `DropdownMenuItem`, `TooltipTrigger`), put `viewTransition` on the `Link` / `NavLink` you pass in.
   - Do **not** call `document.startViewTransition()` yourself. Do **not** use a raw `<a href>` for in-app routes.
   - Default is a page cross-fade. Add named `view-transition-name` / `useViewTransitionState` only when a shared-element morph is required.

---

## Component Pattern / Recipe

### 1. Section Structure

```tsx
import { useTranslation } from "react-i18next";

interface FeaturedSectionProps {
  // props...
}

export default function FeaturedSection({}: FeaturedSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="page-shell space-y-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("dashboard.featured.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {t("dashboard.featured.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id}>{/* card */}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

_(If animated viewport reveals are needed, wrap elements with the `animations` skill.)_

### 2. Route Page (`src/routes/dashboard/...-page.tsx`)

```tsx
import FeaturedSection from "@/features/featured/components/featured-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function FeaturedPage() {
  useDocumentTitle("dashboard.featured.title");

  return (
    <main className="min-h-screen py-8">
      <FeaturedSection />
    </main>
  );
}
```

Register the page in `src/routes/index.tsx` under the dashboard layout. Do not create `app/**/page.tsx`.

### 3. Small Icon Tooltip Pattern

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart } from "lucide-react";

<TooltipProvider delay={100}>
  <Tooltip>
    <TooltipTrigger
      type="button"
      aria-label={t("favorites")}
      className="flex size-8 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted sm:size-9"
      onClick={handleToggleFavorite}
    >
      <Heart className="size-4 sm:size-5" />
    </TooltipTrigger>
    <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
      {t("favorites")}
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

When wrapping an existing link or button, use the `render` prop on `TooltipTrigger`. Put `viewTransition` on that `Link` / `NavLink`.

### 4. View Transitions on Links & Navigation

Always opt in. React Router wraps the navigation in `document.startViewTransition()`.

```tsx
import { Form, Link, NavLink, useNavigate } from "react-router";

<Link to={href} viewTransition>
  فتح الصفحة
</Link>

<NavLink to={item.href} viewTransition onClick={handleNavigate}>
  {item.label}
</NavLink>

<Form method="post" action="/logout" viewTransition>
  {/* … */}
</Form>
```

Programmatic navigation:

```tsx
const navigate = useNavigate();

navigate(ROUTES.settings, { viewTransition: true });
```

When a primitive owns the click target via `render`, the prop still lives on the router component:

```tsx
<SidebarMenuButton
  isActive={isActive}
  tooltip={{ children: item.label, side: "left" }}
  render={<NavLink to={item.href} viewTransition onClick={handleNavigate} />}
>
  <Icon size={18} />
  <span>{item.label}</span>
</SidebarMenuButton>
```

Optional shared-element morph (list → detail). Assign a name only while that route is transitioning:

```tsx
import { Link, useViewTransitionState } from "react-router";

function StatLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isTransitioning = useViewTransitionState(href);

  return (
    <Link
      to={href}
      viewTransition
      style={{ viewTransitionName: isTransitioning ? "stat-card" : "none" }}
    >
      {children}
    </Link>
  );
}
```

Or use `NavLink`'s render state:

```tsx
<NavLink to={href} viewTransition>
  {({ isTransitioning }) => (
    <span style={{ viewTransitionName: isTransitioning ? "stat-card" : "none" }}>
      {label}
    </span>
  )}
</NavLink>
```

---

## Summary of Global Utilities & Helpers

- **CSS Utility**: `page-shell` (in `src/index.css`)
- **Full Bleed Utility**: `full-bleed` (in `src/index.css`)
- **Animations Skill**: Motion wrappers (`FadeIn`, `ScaleIn`, `StaggerContainer`, etc.)
- **View Transitions**: `viewTransition` on `Link` / `NavLink` / `Form`; `{ viewTransition: true }` on `navigate()`
- **Icon Tooltips**: `@/components/ui/tooltip`
- **Missing / Custom Icons**: Verify `public/icons/` and prompt the user when absent
- **Copy voice**: Formal + gender-neutral (`ar` / `en` — see i18n principle above)
