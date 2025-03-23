"use client";

import { authClient } from "@/auth-client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface ImpersonateUser {
  userId: string;
}

export default function ImpersonateUser({ userId }: ImpersonateUser) {
  const router = useRouter();
  const { toast } = useToast();

  const handleImpersonateUser = async () => {
    try {
      await authClient.admin.impersonateUser({
        userId: userId,
      });
      router.push("/");
      toast({
        title: "Impersonated User",
        description: "You are now impersonating the user.",
      });
    } catch (error) {
      console.error("Failed to impersonate user:", error);
    }
  };
  return (
    <Button onClick={handleImpersonateUser} variant="outline" size="sm">
      Impersonate
    </Button>
  );
}
