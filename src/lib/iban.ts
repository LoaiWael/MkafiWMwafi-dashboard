/**
 * Formats a Saudi IBAN in groups of 4 characters:
 * e.g. "SA0380000000608010167519" -> "SA03 8000 0000 6080 1016 7519"
 */
export function formatIban(iban?: string | null): string {
  if (!iban) return "";
  const cleaned = iban.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (!cleaned) return "";
  return cleaned.match(/.{1,4}/g)?.join(" ") ?? cleaned;
}
