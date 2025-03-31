"use client";

import { authClient } from "@/auth-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminButton() {
  const { data, isPending } = authClient.useSession();
  if (isPending) return <div>Loading...</div>;

  const session = data;

  if (session?.user.role != "admin") return null;
  return (
    <div className="flex gap-2 justify-center">
      <Link href="/admin">
        <Button>Admin</Button>
      </Link>
    </div>
  );
}
