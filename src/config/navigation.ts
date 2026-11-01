export interface NavItem {
  to: "/" | "/studio" | "/dashboard" | "/how-it-works";
  label: string;
}

export const mainNav: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/studio", label: "Studio" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/how-it-works", label: "How it works" },
];
