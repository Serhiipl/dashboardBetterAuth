// import { authClient } from "@/auth-client";

// export function useIsAuthenticated(): boolean {
//   const { data: session, error } = authClient.useSession();
//   if (error) {
//     console.error("Error fetching session:", error);
//     return false;
//   }
//   return !!session;
// }
// export function useIsAdmin(): boolean {
//   const { data: session, error } = authClient.useSession();
//   if (error) {
//     console.error("Error fetching session:", error);
//     return false;
//   }
//   return session?.user.role === "admin";
// }
import { authClient } from "@/auth-client";

export function useIsAuthenticated(): boolean {
  const { data: session, error, isPending } = authClient.useSession();

  if (isPending) return false; // можна додати окрему логіку очікування
  if (error) {
    console.error("Auth error:", error);
    return false;
  }

  return Boolean(session);
}

export function useIsAdmin(): boolean {
  const { data: session, error, isPending } = authClient.useSession();

  if (isPending) return false;
  if (error) {
    console.error("Auth error:", error);
    return false;
  }

  return session?.user?.role === "admin";
}
