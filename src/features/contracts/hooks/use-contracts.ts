import { useEffect, useState } from "react";
import { fetchContracts } from "../api/contracts-api";
import type {
  Contract,
  ContractResourceDto,
  ContractsListMeta,
  ContractsListParams,
  ContractsStatisticsDto,
} from "../types";

export function useContracts(params: ContractsListParams = { per_page: 15 }) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [rawContracts, setRawContracts] = useState<ContractResourceDto[]>([]);
  const [meta, setMeta] = useState<ContractsListMeta | undefined>(undefined);
  const [statistics, setStatistics] = useState<ContractsStatisticsDto | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const serializedParams = JSON.stringify(params);

  async function refetch() {
    setIsFetching(true);
    setIsError(false);
    setError(null);
    try {
      const result = await fetchContracts(params);
      setContracts(result.contracts);
      setRawContracts(result.raw);
      setMeta(result.meta);
      setStatistics(result.statistics);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setIsError(true);
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    refetch().catch(() => {});
  }, [serializedParams]);

  return {
    contracts,
    rawContracts,
    meta,
    statistics,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}

/**
 * Lightweight hook to get the total contracts count for UI badges / counters (e.g. Sidebar).
 */
export function useContractsCount() {
  const [count, setCount] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsFetching(true);

    fetchContracts({ per_page: 1 })
      .then((res) => {
        if (isMounted) {
          const total = res.statistics?.total ?? res.meta?.total ?? res.contracts.length;
          setCount(total);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCount(undefined);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
          setIsFetching(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    count,
    isLoading,
    isFetching,
  };
}
