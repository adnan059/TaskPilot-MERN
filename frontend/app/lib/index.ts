export const publicRouteMatchers = [
  (path: string) => path === "/",
  (path: string) => path === "/sign-up",
  (path: string) => path === "/sign-in",
  (path: string) => path === "/verify-email",
  (path: string) => path.startsWith("/verify/"),
  (path: string) => path === "/reset-password",
  (path: string) => path === "/forgot-password",
];
