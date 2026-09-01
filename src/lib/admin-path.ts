/** Public secret path for Admin CRM (rewritten to /admin internally). */
export const ADMIN_PUBLIC_BASE =
  process.env.NEXT_PUBLIC_ADMIN_PATH?.replace(/\/$/, "") || "/dt-ops-console";

/** Internal app route prefix for admin pages. */
export const ADMIN_INTERNAL_BASE = "/admin";

export function adminHref(path = ""): string {
  const p = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${ADMIN_PUBLIC_BASE}${p}`;
}

export function isAdminPublicPath(pathname: string): boolean {
  return pathname === ADMIN_PUBLIC_BASE || pathname.startsWith(`${ADMIN_PUBLIC_BASE}/`);
}
