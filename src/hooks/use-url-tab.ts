import { useSearchParams } from "react-router";

export interface UseUrlTabOptions<T extends string = string> {
  /** The search parameter key in the URL (defaults to "tab") */
  paramKey?: string;
  /** The default fallback tab value */
  defaultValue: T;
  /** Optional whitelist of valid tab values */
  validValues?: readonly T[] | T[];
  /** Whether to delete the search param from URL when value matches defaultValue (default: false) */
  clearDefaultFromUrl?: boolean;
}

/**
 * Custom hook to synchronize tab state with URL search query parameters.
 * Automatically preserves other query params while replacing history state.
 */
export function useUrlTab<T extends string = string>({
  paramKey = "tab",
  defaultValue,
  validValues,
  clearDefaultFromUrl = false,
}: UseUrlTabOptions<T>): [T, (nextTab: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawValue = searchParams.get(paramKey);

  const isValid = validValues
    ? validValues.includes(rawValue as T)
    : Boolean(rawValue);

  const activeTab: T = isValid && rawValue ? (rawValue as T) : defaultValue;

  function setTab(nextTab: T) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (clearDefaultFromUrl && nextTab === defaultValue) {
          next.delete(paramKey);
        } else {
          next.set(paramKey, nextTab);
        }
        return next;
      },
      { replace: true },
    );
  }

  return [activeTab, setTab];
}
