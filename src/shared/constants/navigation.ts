export const publicNavLinks = [
  { href: "/catalog", label: "Catalog" },
  { href: "/about", label: "About" },
] as const;

export const protectedNavLinks = [
  { href: "/catalog", label: "Catalog" },
  { href: "/favourites", label: "Favourites" },
  { href: "/account", label: "Account" },
] as const;

export const adminNavLinks = [
  { href: "/admin", label: "Admin" },
] as const;

export function isNavLinkActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
