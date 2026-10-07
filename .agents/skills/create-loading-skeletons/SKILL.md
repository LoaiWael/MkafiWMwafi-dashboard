---
name: create-loading-skeletons
description: >-
  Pixel-perfect loading skeleton workflow for routes and feature UI. Use when
  adding Suspense fallbacks, *-skeleton.tsx components, or matching skeletons
  to page layout for CLS / no layout shift.
---

# Loading Skeletons — Pixel-Perfect, Every Page & Component

**Mandatory Rule:** Every route, page, section, or component that fetches data (via TanStack React Query, API client, or custom hooks) **MUST** ship and render a pixel-perfect loading skeleton during the `isLoading` / fetching state.

- **No fake fallback/mock data**: NEVER render hardcoded fake data (names, emails, dates, activity logs) while waiting for an API response. Always show the skeleton until real data arrives.
- **No spinners for content loads**: No spinner overlays, no generic "جاري التحميل…" text, and no single grey box standing in for a full section or page.
- **No layout shift (CLS ≈ 0)**: The skeleton must mirror the loaded UI layout and dimensions 1:1.

This is a Vite + React SPA — skeletons are React components used as `<Suspense>` fallbacks and directly in the hook `isLoading` branch.

## 1. Where the Skeleton Lives & How It Is Used

- **Component & Feature-level (Mandatory for any data-fetching component):**
  - Any feature component fetching data (e.g. `UserContractsPanel`, `ProfileBanner`, `ProfileFacts`, `ContractsTable`, `OverviewStats`) **must** check `if (isLoading)` and return its matching skeleton.
  - Co-locate: `features/[name]/components/x-table.tsx` + `features/[name]/components/x-table-skeleton.tsx`.
- **Route-level:**
  - A `*-page-skeleton.tsx` next to the route page (e.g. `profile-page-skeleton.tsx`, `contracts-page-skeleton.tsx`), used both as the `React.lazy` / `<Suspense>` fallback and inside the page component when the root hook is `isLoading`.
- **Section-level / Independent Blocks:**
  - Wrap independently-loading blocks (a chart, a table, an activity feed) in `<Suspense fallback={<XSkeleton />}>` or guard them with `if (isLoading) return <XSkeleton />` so that other ready parts of the screen paint immediately.

## 2. "Pixel-Perfect" — What It Means

Build the skeleton by copying the real component's JSX tree and replacing only the content-bearing leaf nodes with `<Skeleton>`. Everything else stays identical:

- **Same container:** same wrapper elements, same `Card` / `section`, same padding (`p-3.5 sm:p-6`), same `grid`/`flex`, same `gap-*`, same `space-y-*`, same responsive breakpoints.
- **Same dimensions:** each `<Skeleton>` gets the **same height/width Tailwind classes** the real element resolves to:
  - Text line (`text-sm`) → `h-4`
  - Heading (`text-lg` / `text-xl`) → `h-6` or `h-7`
  - Input / select (`h-10` / `h-11`) → `h-10` / `h-11`
  - Avatar (`size-10` / `size-20` / `size-28`) → `size-10 rounded-full` / `size-20 sm:size-28 rounded-full`
  - Button (`h-9 w-24`) → `h-9 w-24 rounded-lg`
  - Multi-line text blocks: 2–3 `<Skeleton>` lines with the last one `w-2/3`.
- **Same count:**
  - Table skeleton renders `DEFAULT_PAGE_SIZE` rows with one cell per real column, matching column widths.
  - Stat grid renders the real number of cards.
  - List / Activity feed renders 3–5 skeleton items with identical timeline lines and spacing.
- **Same chart footprint:** `<Skeleton className="h-64 w-full" />` inside the same titled container.

Result: when real backend data swaps in, **nothing moves or shifts** — target CLS ≈ 0.

## 3. Implementation Pattern for Data-Fetching Components

```tsx
import { useFeatureData } from "../hooks/use-feature-data";
import FeatureSkeleton from "./feature-skeleton";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function FeatureSection() {
  const { data, isLoading, isError } = useFeatureData();

  // 1. Mandatory loading skeleton branch
  if (isLoading) {
    return <FeatureSkeleton />;
  }

  // 2. Error branch
  if (isError) {
    return <ErrorAlert message="تعذر تحميل البيانات" />;
  }

  // 3. Empty state branch
  if (!data || data.length === 0) {
    return (
      <Empty className="py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon"><Inbox className="size-6 text-muted-foreground" /></EmptyMedia>
          <EmptyTitle>لا توجد بيانات مسجلة</EmptyTitle>
          <EmptyDescription>سيتم عرض البيانات هنا بمجرد توفرها.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  // 4. Render loaded UI
  return (
    <section className="space-y-4">
      {/* Real content */}
    </section>
  );
}
```

## 4. Constraints

- Use `@/components/ui/skeleton` (`<Skeleton>`), never a hand-rolled pulsing div.
- Obey `styling` rule: skeleton sizing uses the Tailwind scale, **no arbitrary values** (`h-[13px]` ❌ → `h-3`). Genuinely dynamic heights go via `style`.
- Themed automatically (`bg-muted` token) — verify in dark mode.
- Keep skeletons static: no data fetching, no context unless a child primitive forces it. They must be cheap to render.
- Don't animate layout in/out (no fade/expand) — instant swap reads as faster.
- Accessibility: the loading container gets `aria-busy="true"`; decorative skeletons need no label.

## 5. Checklist for Any Component or Page Fetching Data

1. Is there an API call or hook fetching data (`useQuery`, `useAdminProfile`, `useContracts`, etc.)?
2. Create or verify the matching `*-skeleton.tsx` component mirroring the final markup 1:1.
3. Add the `if (isLoading) return <ComponentSkeleton />;` branch before using the data.
4. Ensure no fake/mock fallback data is displayed while loading.
5. Provide a rich empty state with `@/components/ui/empty` when data is empty (`length === 0`).
6. Test in browser with network throttling — verify seamless transition with zero layout shift.
