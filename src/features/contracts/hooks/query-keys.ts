import type { ContractsListParams } from "../types";

export const contractsKeys = {
  all: ["admin-contracts"] as const,
  lists: () => [...contractsKeys.all, "list"] as const,
  list: (params?: ContractsListParams) =>
    [...contractsKeys.lists(), params ?? {}] as const,
  details: () => [...contractsKeys.all, "detail"] as const,
  detail: (idOrUuid: string) => [...contractsKeys.details(), idOrUuid] as const,
};
