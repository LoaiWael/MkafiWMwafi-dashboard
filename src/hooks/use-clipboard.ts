import { useCallback, useEffect, useRef, useState } from "react";
import { copyToClipboard } from "@/lib/clipboard";

export interface UseClipboardOptions {
  /**
   * Duration in milliseconds before the copied state resets to false / null.
   * @default 2000
   */
  timeout?: number;
  onSuccess?: (text: string) => void;
  onError?: (error: unknown) => void;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { timeout = 2000, onSuccess, onError } = options;
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setCopiedText(null);
    setCopiedId(null);
  }, [clearTimer]);

  const copy = useCallback(
    async (text: string, id?: string): Promise<boolean> => {
      clearTimer();
      try {
        const success = await copyToClipboard(text);
        if (success) {
          setCopiedText(text);
          if (id !== undefined) {
            setCopiedId(id);
          }
          onSuccess?.(text);

          if (timeout > 0) {
            timeoutRef.current = setTimeout(() => {
              reset();
            }, timeout);
          }
          return true;
        }
        return false;
      } catch (err) {
        onError?.(err);
        return false;
      }
    },
    [clearTimer, timeout, onSuccess, onError, reset],
  );

  const isCopied = useCallback(
    (id?: string): boolean => {
      if (id !== undefined) {
        return copiedId === id;
      }
      return copiedText !== null;
    },
    [copiedId, copiedText],
  );

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    copy,
    isCopied,
    copiedText,
    copiedId,
    hasCopied: copiedText !== null,
    reset,
  };
}
