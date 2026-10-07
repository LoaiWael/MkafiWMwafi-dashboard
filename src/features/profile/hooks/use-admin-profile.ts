import { useEffect, useState, useSyncExternalStore } from "react";
import { COOKIE_KEYS } from "@/lib/constants";
import { getCookie } from "@/lib/cookies";
import { fetchAdminProfile } from "../api/get-admin-profile";
import {
  getAdminState,
  setAdminProfile,
  subscribeAdminState,
} from "../admin-profile-store";

/**
 * Hook to fetch the current admin profile from /api/v1/admin/auth/me
 * and sync with reactive profile state.
 */
export function useAdminProfile() {
  const storeState = useSyncExternalStore(
    subscribeAdminState,
    getAdminState,
    getAdminState
  );

  const token = getCookie(COOKIE_KEYS.authToken);
  const [isLoading, setIsLoading] = useState(
    Boolean(token) && !storeState.profile.id && !storeState.profile.email
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchAdminProfile()
      .then((data) => {
        if (isMounted) {
          setAdminProfile(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  return {
    profile: storeState.profile,
    activity: storeState.activity,
    isLoading,
    isError: Boolean(error),
    error,
    refetch: async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const data = await fetchAdminProfile();
        setAdminProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
  };
}
