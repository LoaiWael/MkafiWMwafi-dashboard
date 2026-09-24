---
name: wire-api
description: >-
  Wire backend API endpoints into application features using lib/api-client,
  React Query hooks, TypeScript DTO↔view-model mappers, and lib/images
  resolveImageUrl. Use when connecting Postman/backend endpoints, replacing
  mocks with real API data, adding feature fetchers, or wiring dashboard/auth
  client state.
---

# Wire API

Follow this workflow whenever connecting a backend endpoint to the dashboard.
Canonical project rules also live in [`AGENTS.md`](../../../AGENTS.md).

## Non-negotiables

1. **Use the shared client** — never ad-hoc `fetch` to the API base URL.
   - [`src/lib/api-client.ts`](../../../src/lib/api-client.ts) → `apiGet` / `apiPost` / `http.get|post|…`, `ApiError`
   - There is **no** `lib/api-server.ts`, Server Action, or RSC fetch in this Vite SPA.
2. **Env only**: `VITE_API_URL` (and documented optional vars) via [`src/lib/env.ts`](../../../src/lib/env.ts). Do not invent parallel base-URL vars. Do not read `import.meta.env` in features.
3. **No new packages** without asking the user.
4. **Feature-sliced layout** under `src/features/<feature>/`:
   ```
   services/     # fetchers (call apiGet / apiPost)
   types/        # API DTOs + domain view models (TypeScript only — no Zod for responses)
   hooks/        # React Query useQuery / useMutation
   query-keys.ts
   schemas/      # Zod — forms only
   components/   # UI that reads the hook
   ```
5. **Zod** is for **forms** only. API response shapes = TypeScript interfaces in `types/`.
6. **Media** through `resolveImageUrl` when that helper exists. If there is no image `src` (null, undefined, or empty string), do not render `<img>` — omit it or show a non-image fallback.

## Workflow checklist

```
API wiring:
- [ ] 1. Confirm endpoint path, method, auth, sample JSON (Postman / user paste)
- [ ] 2. Add API DTO types + view models in features/<f>/types/
- [ ] 3. Write mapper(s) in features/<f>/utils/ (snake_case API → camelCase UI)
- [ ] 4. Write fetcher in features/<f>/services/ using apiGet/apiPost; throw on failure
- [ ] 5. Add query-keys.ts + React Query hook in features/<f>/hooks/
- [ ] 6. Wire components to the hook with the matching skeleton during isLoading
- [ ] 7. Resolve images in mappers; UI skips <img> when src is missing/empty
- [ ] 8. Add/update i18n only for chrome UI (CTAs, loading, errors) — not API copy
- [ ] 9. Update AGENTS.md if a new cross-feature convention appeared
```

## Step details

### 1. Endpoint contract

- Prefer user-provided response JSON over guessing.
- Probe only with safe GETs when the base URL is already in `.env`.
- Pass `Accept-Language` from i18next (the API client should do this).

### 2. Types

```ts
// types/api.ts — raw backend shapes (snake_case OK)
export interface ApiThingResponse {
  success: boolean;
  message: string;
  data: ApiThingData;
}

// types/index.ts — view models (camelCase)
export interface Thing {
  id: string;
  title: string;
  image: string | null;
}
```

Keep domain types Zod-free.

### 3. Fetcher (`services/`)

```ts
import { apiGet } from "@/lib/api-client";
import type { Thing, ThingListParams } from "../types";

export async function getThings(params: ThingListParams, signal?: AbortSignal) {
  return apiGet<Thing[]>("/things", { params, signal });
}
```

- No `try/catch` in services — let `ApiError` propagate to React Query.
- No `next: { revalidate, tags }` — that is a Next.js cache API and does not exist here.

### 4. React Query hook (`hooks/`)

```ts
import { useQuery } from "@tanstack/react-query";
import { getThings } from "../services/get-things";
import { thingKeys } from "../query-keys";
import type { ThingListParams } from "../types";

export function useThingList(params: ThingListParams) {
  return useQuery({
    queryKey: thingKeys.list(params),
    queryFn: ({ signal }) => getThings(params, signal),
  });
}
```

**One queryKey per resource+params** — multiple components must call the same hook / key so the API is hit once.

### 5. Components & Skeleton Loading

- Feature components call the hook. Route pages stay thin.
- Always provide a visual skeleton during `isLoading` (`create-loading-skeletons` skill).
- Empty states: `@/components/ui/empty` or `null`.
- Do **not** duplicate fetch logic inside each component.
- Images: only mount `<img>` when `src` is a non-empty string.

```tsx
{item.image ? (
  <img src={item.image} alt={item.title} className="size-full object-cover" />
) : null}
```

### 6. i18n

- API-supplied titles/descriptions render as data (no message keys per entity).
- Add `loading` / CTA / error strings to `src/messages/{ar,en}.json` with formal gender-neutral copy.

### 7. Scope discipline

- Wire **only** what the user asked.
- Leave unrelated mocks untouched until their endpoint is specified.

## Anti-patterns

- Raw `fetch(\`${import.meta.env.VITE_API_URL}/...\`)` in components
- `process.env.NEXT_PUBLIC_*` or Next.js `next: { revalidate }` options
- Zod schemas for read-only API payloads
- Per-component refetch of the same endpoint
- Server Actions / `api-server` / `'use client'`
- Installing axios / ky / another HTTP lib without approval
- Rendering `<img src="">` when `src` is null, undefined, or `""`

## After wiring

- If you introduced a **repo-wide** convention (new env var, client helper, cache pattern), update [`AGENTS.md`](../../../AGENTS.md).
