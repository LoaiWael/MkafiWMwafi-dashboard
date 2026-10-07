import { useEffect, useState } from "react";
import { fetchContract } from "../api/contracts-api";
import type { Contract } from "../types";

export function useContractDetails(contractUuid: string | undefined | null) {
  const [contract, setContract] = useState<Contract | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(Boolean(contractUuid));
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function refetch() {
    if (!contractUuid) {
      setContract(undefined);
      setIsLoading(false);
      return;
    }

    setIsFetching(true);
    setIsError(false);
    setError(null);
    try {
      const result = await fetchContract(contractUuid);
      setContract(result);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setIsError(true);
      setError(errorObj);
      setContract(undefined);
      throw errorObj;
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }

  useEffect(() => {
    if (contractUuid) {
      setIsLoading(true);
      refetch().catch(() => {});
    } else {
      setContract(undefined);
      setIsLoading(false);
    }
  }, [contractUuid]);

  return {
    contract,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
