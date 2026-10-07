export interface CookieOptions {
  days?: number;
  maxAge?: number;
  path?: string;
  sameSite?: "strict" | "lax" | "none";
  secure?: boolean;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const nameEQ = `${encodeURIComponent(name)}=`;
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      try {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      } catch {
        return c.substring(nameEQ.length, c.length);
      }
    }
  }

  return null;
}

/**
 * Set a cookie with name, value, and optional lifetime/path settings
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (typeof document === "undefined") {
    return;
  }

  const {
    days,
    maxAge,
    path = "/",
    sameSite = "lax",
    secure = typeof window !== "undefined" && window.location.protocol === "https:",
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (typeof days === "number") {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  } else if (typeof maxAge === "number") {
    cookieString += `; max-age=${maxAge}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  if (secure) {
    cookieString += "; secure";
  }

  document.cookie = cookieString;
}

/**
 * Delete a cookie by setting its expiration to the past
 */
export function removeCookie(name: string, path = "/"): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; samesite=lax`;
}
