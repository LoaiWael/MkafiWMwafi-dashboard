import { http } from "@/lib/api-client";
import type {
  ApiResponse,
  Contract,
  ContractResourceDto,
  ContractsListMeta,
  ContractsListParams,
  ContractsResponsePayload,
  ContractsStatisticsDto,
  PaginatedPayload,
} from "../types";
import { mapContractDtoToViewModel } from "../utils/map-contract";

export interface ContractsFetchResult {
  contracts: Contract[];
  raw: ContractResourceDto[];
  meta?: ContractsListMeta;
  statistics?: ContractsStatisticsDto;
}

export async function fetchContracts(
  params: ContractsListParams = { per_page: 15 },
): Promise<ContractsFetchResult> {
  const queryParams: Record<string, string | number | undefined> = {
    per_page: params.per_page ?? 15,
    page: params.page,
    search: params.search,
    status: params.status,
    payment_status: params.payment_status,
    contract_type: params.contract_type,
  };

  const response = await http.get<
    ApiResponse<
      | ContractResourceDto[]
      | ContractsResponsePayload
      | PaginatedPayload<ContractResourceDto>
    >
  >("/api/v1/admin/contracts", { params: queryParams });

  let rawList: ContractResourceDto[] = [];
  let meta = response.meta;
  let statistics: ContractsStatisticsDto | undefined = undefined;

  if (Array.isArray(response.data)) {
    rawList = response.data;
  } else if (response.data && typeof response.data === "object") {
    const payload = response.data as ContractsResponsePayload;
    if (Array.isArray(payload.contracts)) {
      rawList = payload.contracts;
    } else if (Array.isArray(payload.data)) {
      rawList = payload.data;
    }
    if (payload.meta) {
      meta = payload.meta;
    }
    if (payload.statistics) {
      statistics = payload.statistics;
    }
  }

  // Fallback if statistics was attached to the root response
  if (!statistics && (response as any).statistics) {
    statistics = (response as any).statistics;
  }

  const contracts = rawList.map(mapContractDtoToViewModel);

  return {
    contracts,
    raw: rawList,
    meta,
    statistics,
  };
}

export async function fetchContract(contractUuid: string): Promise<Contract> {
  const response = await http.get<
    ApiResponse<ContractResourceDto | { data: ContractResourceDto }>
  >(`/api/v1/admin/contracts/${contractUuid}`);

  if (!response.data) {
    throw new Error("لم يتم العثور على بيانات العقد");
  }

  const rawData = (
    typeof response.data === "object" &&
    response.data !== null &&
    "data" in response.data &&
    !("id" in response.data)
      ? (response.data as { data: ContractResourceDto }).data
      : response.data
  ) as ContractResourceDto;

  if (!rawData || !rawData.id) {
    throw new Error("لم يتم العثور على بيانات العقد");
  }

  return mapContractDtoToViewModel(rawData);
}
