/**
 * Copies a given text string to the user's clipboard.
 * Supports modern `navigator.clipboard` with an automatic fallback for legacy or restricted environments.
 *
 * @param text The string to copy to the clipboard.
 * @returns A promise that resolves to `true` if successful, or `false` on failure.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text && text !== "") return false;

  // 1. Try modern navigator.clipboard API if available and securely permitted
  if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback to legacy execCommand below
    }
  }

  // 2. Fallback for non-secure contexts or older browser environments
  if (typeof document !== "undefined") {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-999999px";
      textarea.style.top = "-999999px";
      textarea.setAttribute("readonly", "");
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);

      return successful;
    } catch {
      return false;
    }
  }

  return false;
}
