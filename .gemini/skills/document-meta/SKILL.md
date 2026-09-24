---
name: document-meta
description: >-
  SPA document title, html lang/dir, and robots noindex for this private
  dashboard. Use when creating or updating a route page, setting the browser
  tab title, or changing locale direction.
---

# Document Meta — Private Dashboard SPA

This app is an authenticated Vite + React dashboard. It is **not** SEO-indexable.
Do not add `sitemap.ts`, `robots.ts`, `generateMetadata`, Open Graph images,
JSON-LD, or `"use cache"`. Those are Next.js App Router APIs and do not exist here.

## 1. Robots / Indexing

- `index.html` (or a `<meta name="robots" content="noindex, nofollow" />`)
  marks the whole SPA as private.
- Do not submit a sitemap. Do not add public marketing routes to this repo.

## 2. Per-Route Document Title

Set the tab title from the route page with a small hook (create
`src/hooks/use-document-title.ts` if it does not exist yet):

```tsx
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function UsersPage() {
  useDocumentTitle("users.title");
  return <UsersTable />;
}
```

The hook:

- Calls `t(key)` from `react-i18next` and writes `document.title`.
- Uses a shared template (`%s | مكفي وموفي` / site name from constants).
- Restores the previous title on unmount when navigating away.

Do not install `react-helmet-async` unless a route needs more than title + lang/dir.

## 3. `html` lang and dir

When the `/:locale` param changes:

- `document.documentElement.lang = locale`
- `document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"`
- i18next `changeLanguage(locale)`

Own this in one place (router layout or i18n bootstrap) — not in every page.

## 4. Checklist for a New Route

1. Add the page under `src/routes/auth/` or `src/routes/dashboard/`.
2. Register it in `src/routes/index.tsx`.
3. Call `useDocumentTitle` with a translated key (add `ar` + `en` messages).
4. Confirm locale switch still updates `lang` / `dir`.
5. Do **not** add metadata exports, OG images, or sitemap entries.
