import { sendVerificationEmail } from "@/actions/email";
import { prisma } from "@/lib/prisma";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  plugins: [openAPI()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
      await sendVerificationEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Click the link to verify your email:${verificationUrl}`,
      });
    },
  },
} satisfies BetterAuthOptions);
