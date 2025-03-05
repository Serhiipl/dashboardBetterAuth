import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  // clientId: process.env.BETTER_AUTH_CLIENT_ID,
  // clientSecret: process.env.BETTER_AUTH_CLIENT_SECRET,
});
