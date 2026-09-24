---
name: create-loading-skeletons
description: >-
  Pixel-perfect loading skeleton workflow for routes and feature UI. Use when
  adding Suspense fallbacks, *-skeleton.tsx components, or matching skeletons
  to page layout for CLS / no layout shift.
---

# Loading Skeletons — Pixel-Perfect, Every Page

**Rule:** every route/page you create ships a skeleton that matches its loaded
layout 1:1. No spinners for page/content loads. No generic "loading…" text. No
single grey rectangle standing in for a whole screen.

This is a Vite + React SPA — there is no `loading.tsx` App Router file. Skeletons
are React components used as `<Suspense>` fallbacks and as the hook `isLoading`
branch.

## 1. Where the Skeleton Lives
- **Route-level:** a `*-page-skeleton.tsx` next to the route page, used as the
  `React.lazy` / `<Suspense>` fallback while the page chunk loads.
- **Section-level:** wrap independently-loading blocks (a chart, a table, a feed)
  in `<Suspense fallback={<XSkeleton />}>` so the rest of the page paints first.
- **Client-fetched data:** the feature component renders the **same** skeleton
  component when its hook is `isLoading`. One skeleton definition, reused by
  Suspense and the `isLoading` branch.
- Co-locate: `features/[name]/components/x-table.tsx` +
  `features/[name]/components/x-table-skeleton.tsx`.

## 2. "Pixel-Perfect" — What It Means
Build the skeleton by copying the real component's JSX tree and replacing only the
content-bearing leaf nodes with `<Skeleton>`. Everything else stays identical:
- **Same container:** same wrapper elements, same `Card`, same padding, same
  `grid`/`flex`, same `gap-*`, same `space-y-*`, same responsive breakpoints.
- **Same dimensions:** each `<Skeleton>` gets the **same height/width Tailwind
  classes** the real element resolves to — a `text-sm` line → `h-4`, an `h-11`
  input → `h-11`, an avatar `size-10` → `size-10 rounded-full`, a button `h-9 w-24`
  → `h-9 w-24`. Text blocks: 2–3 `<Skeleton>` lines, last one `w-2/3`.
- **Same count:** table skeleton renders `DEFAULT_PAGE_SIZE` rows
  (`constants` rule) with one cell per real column, matching column widths. Stat
  grid renders the real number of cards. List renders a sensible page's worth.
- **Same chart footprint:** `<Skeleton className="h-64 w-full" />` (or whatever
  the real `ChartContainer` height is) inside the same titled `Card`.

Result: when real content swaps in, **nothing moves** — target CLS ≈ 0.

## 3. Constraints
- Use `@/components/ui/skeleton` (`<Skeleton>`), never a hand-rolled pulsing div.
- Obey `styling` rule: skeleton sizing uses the Tailwind scale, **no arbitrary
  values** (`h-[13px]` ❌ → `h-3`). Genuinely dynamic heights go via `style`.
- Themed automatically (`bg-muted` token) — verify in dark mode anyway.
- Keep skeletons static: no data fetching, no context unless a child primitive
  forces it. They must be cheap to render.
- Don't animate layout in/out (no fade/expand) — instant swap reads as faster.
- Accessibility: the loading container gets `aria-busy="true"`; decorative
  skeletons need no label.

## 4. Checklist for a New Page
1. Build the route page and its feature components.
2. Create the matching `*-skeleton.tsx` component(s) mirroring the final markup.
3. Wire those skeletons into `<Suspense fallback={…}>` (lazy routes / charts)
   and hook `isLoading` branches.
4. Toggle a slow network in devtools — confirm zero layout shift when data arrives.
