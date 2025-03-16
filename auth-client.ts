import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [adminClient()],
  // clientId: process.env.BETTER_AUTH_CLIENT_ID,
  // clientSecret: process.env.BETTER_AUTH_CLIENT_SECRET,
});
