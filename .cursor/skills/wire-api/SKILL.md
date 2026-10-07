---
name: wire-api
description: >-
  Wire backend API endpoints into application features using src/lib/api-client.ts
  (http.get, http.post, http.put, http.patch, http.delete, apiClient, ApiError),
  TanStack React Query v5 hooks, TypeScript DTO↔view-model mappers, and loading
  skeletons in this Vite + React SPA dashboard.
---

# Wire API

Follow this workflow whenever connecting a backend API endpoint to the dashboard.
Canonical project architecture and conventions live in [`AGENTS.md`](../../../AGENTS.md).

## Non-negotiables

1. **Use the shared client** — never use ad-hoc `fetch()` or third-party HTTP clients (axios, ky):
   - [`src/lib/api-client.ts`](../../../src/lib/api-client.ts) → `http.get`, `http.post`, `http.put`, `http.patch`, `http.delete`, `apiClient`, `ApiError`
   - Automatically attaches auth token from `localStorage.getItem(STORAGE_KEYS.authToken)`
   - Handles query parameters via `params: Record<string, string | number | boolean | undefined | null>`
   - Handles JSON serialization, 204 No Content, and throws `ApiError` with status and message on failures.
2. **Environment variables**:
   - `VITE_API_BASE_URL` accessed exclusively via [`src/lib/env.ts`](../../../src/lib/env.ts) (`env.API_BASE_URL`).
   - Never use `process.env` or `NEXT_PUBLIC_*`.
3. **Vite + React SPA Architecture & React Compiler**:
   - Client-rendered SPA. Every component runs in the browser.
   - **No Next.js**: No `'use client'`, no `serverFetch`, no Server Actions, no `next/image`, no `next/font`.
   - **React Compiler is enabled**: **DO NOT** use `useMemo`, `useCallback`, or `React.memo`. Write clean, standard functions and direct variable expressions.
4. **RTL & Arabic-Only UI**:
   - Use direct, formal, gender-neutral Arabic copy in components, placeholders, toasts, and fallback errors.
   - No i18n libraries (`next-intl`, `react-i18next`), no locale routes, no `useLocale()`.
5. **Feature-Sliced Layout** under `src/features/<feature>/`:
   ```
   api/          # API fetchers & mutation functions (calling http.* / apiClient)
   types/        # API DTOs + UI view models (TypeScript interfaces — no Zod for responses)
   hooks/        # TanStack React Query hooks (useQuery, useMutation)
   utils/        # Mappers (snake_case API DTO <-> camelCase UI model)
   components/   # UI components consuming feature hooks
   schemas/      # Zod validation schemas for forms (react-hook-form)
   index.ts      # Feature public barrel exports
   ```
6. **Zod is for Forms only** (`schemas/` + `react-hook-form`). API response shapes are defined with strict TypeScript interfaces in `types/`.
7. **Media & Image Rendering**:
   - Use standard `<img>` or custom avatar/thumbnail components with design tokens.
   - If an image URL is null, undefined, or empty string `""`, **never** render `<img src="" />`. Always omit the tag or render a placeholder/skeleton icon.

---

## Workflow Checklist

Copy and track during API integration tasks:

```
API wiring:
- [ ] 1. Confirm endpoint path, HTTP method, auth requirement, query params, and sample JSON payload
- [ ] 2. Define API DTO types + UI domain view models in src/features/<f>/types/
- [ ] 3. Write pure mapper(s) in src/features/<f>/utils/ (API DTO -> UI domain model)
- [ ] 4. Write fetcher / mutation functions in src/features/<f>/api/ using http.* or apiClient
- [ ] 5. Add TanStack React Query hook(s) in src/features/<f>/hooks/ (shared query keys & invalidations)
- [ ] 6. Wire UI components to the hook with loading skeletons (create-loading-skeletons skill)
- [ ] 7. Handle empty states, error banners/toasts, and optimistic/mutation updates
- [ ] 8. Export public feature symbols from src/features/<f>/index.ts
- [ ] 9. Check feature for leftover mock JSON/fixtures & ask user to clean them up
- [ ] 10. Verify TypeScript build: npm run build
```

---

## Step Details & Code Patterns

### 1. Types (`types/`)

Separate the raw backend contract (often `snake_case`) from the clean frontend model (camelCase).

```ts
// src/features/contracts/types/api.ts
export interface ContractDto {
  id: string;
  contract_number: string;
  contract_type: "residential" | "commercial";
  status: "active" | "pending" | "expired" | "cancelled";
  lessor_name: string;
  tenant_name: string;
  annual_rent: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface ContractsListApiResponse {
  success: boolean;
  data: ContractDto[];
  total: number;
  page: number;
  page_size: number;
}

// src/features/contracts/types/index.ts
export interface Contract {
  id: string;
  contractNumber: string;
  contractType: "residential" | "commercial";
  status: "active" | "pending" | "expired" | "cancelled";
  lessorName: string;
  tenantName: string;
  annualRent: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface ContractsFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  type?: string;
}
```

### 2. Mappers (`utils/`)

Pure transformation functions isolate backend schema changes from the UI:

```ts
// src/features/contracts/utils/map-contract.ts
import type { ContractDto } from "../types/api";
import type { Contract } from "../types";

export function mapContractDto(dto: ContractDto): Contract {
  return {
    id: dto.id,
    contractNumber: dto.contract_number,
    contractType: dto.contract_type,
    status: dto.status,
    lessorName: dto.lessor_name,
    tenantName: dto.tenant_name,
    annualRent: dto.annual_rent,
    startDate: dto.start_date,
    endDate: dto.end_date,
    createdAt: dto.created_at,
  };
}
```

### 3. Fetchers & Mutations (`api/`)

Use `http` from `@/lib/api-client`. Functions throw `ApiError` automatically when response is not OK.

```ts
// src/features/contracts/api/get-contracts.ts
import { http } from "@/lib/api-client";
import type { ContractsListApiResponse, ContractsFilterParams, Contract } from "../types";
import { mapContractDto } from "../utils/map-contract";

export interface GetContractsResult {
  contracts: Contract[];
  total: number;
  page: number;
}

export async function fetchContracts(params?: ContractsFilterParams): Promise<GetContractsResult> {
  const response = await http.get<ContractsListApiResponse>("/api/v1/contracts", {
    params: {
      page: params?.page,
      page_size: params?.pageSize,
      search: params?.search || undefined,
      status: params?.status || undefined,
      type: params?.type || undefined,
    },
  });

  return {
    contracts: (response.data || []).map(mapContractDto),
    total: response.total ?? 0,
    page: response.page ?? 1,
  };
}

// src/features/contracts/api/create-contract.ts
import { http } from "@/lib/api-client";
import type { ContractDto } from "../types/api";
import type { Contract } from "../types";
import { mapContractDto } from "../utils/map-contract";

export async function createContract(payload: Record<string, unknown>): Promise<Contract> {
  const response = await http.post<{ success: boolean; data: ContractDto }>(
    "/api/v1/contracts",
    payload
  );
  return mapContractDto(response.data);
}
```

### 4. TanStack React Query Hooks (`hooks/`)

Define centralized query keys and hook functions:

```ts
// src/features/contracts/hooks/useContracts.ts
import { useQuery } from "@tanstack/react-query";
import { fetchContracts } from "../api/get-contracts";
import type { ContractsFilterParams } from "../types";

export const contractsQueryKeys = {
  all: ["contracts"] as const,
  list: (params?: ContractsFilterParams) => ["contracts", "list", params] as const,
  detail: (id: string) => ["contracts", "detail", id] as const,
};

export function useContracts(params?: ContractsFilterParams) {
  return useQuery({
    queryKey: contractsQueryKeys.list(params),
    queryFn: () => fetchContracts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// src/features/contracts/hooks/useCreateContract.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContract } from "../api/create-contract";
import { contractsQueryKeys } from "./useContracts";

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractsQueryKeys.all });
    },
  });
}
```

### 5. Component Usage & Skeleton UI

```tsx
// src/features/contracts/components/contracts-table.tsx
import { useContracts } from "../hooks/useContracts";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export function ContractsTable({ filters }: { filters: ContractsFilterParams }) {
  const { data, isLoading, isError, error } = useContracts(filters);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        حدث خطأ أثناء تحميل البيانات: {error?.message || "يرجى المحاولة لاحقاً."}
      </div>
    );
  }

  if (!data?.contracts.length) {
    return <EmptyState title="لا توجد عقود" description="لم يتم العثور على أي عقود مطابقة لخيارات البحث." />;
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Render contracts list */}
    </div>
  );
}
```

---

## Anti-patterns to Avoid

- ❌ **DO NOT** use ad-hoc `fetch("http://...")` or install axios / ky. Always use `http.*` or `apiClient` from `@/lib/api-client`.
- ❌ **DO NOT** use `process.env` or `NEXT_PUBLIC_*`. Use `env.API_BASE_URL` from `@/lib/env`.
- ❌ **DO NOT** use `'use client'`, `serverFetch`, or Next.js Server Actions in this Vite SPA.
- ❌ **DO NOT** use `useMemo`, `useCallback`, or `React.memo` (React Compiler handles this automatically).
- ❌ **DO NOT** use Zod schemas to validate API responses. Use clean TypeScript interfaces in `types/`.
- ❌ **DO NOT** hardcode arbitrary hex colors. Use design tokens from `src/index.css`.
- ❌ **DO NOT** render `<img src="" />` when image URL is missing. Guard with `if (!src) return null;` or show fallback icon.
