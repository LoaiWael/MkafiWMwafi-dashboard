import { useEffect, useState } from "react";
import { fetchAdminMe } from "../api/get-admin-me";
import { loginAdmin } from "../api/admin-login";
import { logoutAdminApi } from "../api/admin-logout";
import { getAuthState, logoutAdmin, setAuthUser } from "../auth-store";
import type { AdminLoginRequest, AdminUser } from "../types";

/**
 * Hook to fetch the current authenticated admin profile from /api/v1/admin/auth/me
 */
export function useAdminMe() {
  const authState = getAuthState();
  const [user, setUser] = useState<AdminUser | null>(authState.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!authState.token) {
      setUser(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetchAdminMe()
      .then((data) => {
        if (isMounted) {
          setUser(data);
          setAuthUser(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          if (err?.status === 401) {
            logoutAdmin();
          }
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [authState.token]);

  return {
    user: user || authState.user,
    isLoading,
    isError: Boolean(error),
    error,
  };
}

/**
 * Hook to log in as admin
 */
export function useAdminLogin() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function mutateAsync(payload: AdminLoginRequest) {
    setIsPending(true);
    setError(null);
    try {
      const session = await loginAdmin(payload);
      setAuthUser(session.user);
      return session;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw err;
    } finally {
      setIsPending(false);
    }
  }

  return {
    mutateAsync,
    isPending,
    error,
  };
}

/**
 * Hook to log out admin
 */
export function useAdminLogout() {
  const [isPending, setIsPending] = useState(false);

  async function mutateAsync() {
    setIsPending(true);
    try {
      await logoutAdminApi();
    } finally {
      logoutAdmin();
      setIsPending(false);
    }
  }

  return {
    mutateAsync,
    isPending,
  };
}
