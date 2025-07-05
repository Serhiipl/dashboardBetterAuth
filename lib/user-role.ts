import { authClient } from "@/auth-client";

export function useIsAuthenticated(): boolean {
  const { data: session, error } = authClient.useSession();
  if (error) {
    console.error("Error fetching session:", error);
    return false;
  }
  return !!session;
}
export function useIsAdmin(): boolean {
  const { data: session, error } = authClient.useSession();
  if (error) {
    console.error("Error fetching session:", error);
    return false;
  }
  return session?.user.role === "admin";
}
