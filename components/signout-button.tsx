"use client";

import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingButton from "@/components/loading-button";

export default function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSingOut = async () => {
    try {
      setPending(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in");
          },
        },
      });
    } catch (error) {
      console.error("Error singing out", error);
    } finally {
      setPending(false);
    }
  };
  return (
    <LoadingButton pending={pending} onClick={handleSingOut}>
      Sign Out
    </LoadingButton>
  );
}
