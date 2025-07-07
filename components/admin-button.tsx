"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface AdminButtonProps {
  userRole?: string | null; // Optional prop to pass user role
}

export default function AdminButton({ userRole }: AdminButtonProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isAdminRoute = pathname.startsWith("/admin");

  if (userRole !== "admin" || isAdminRoute) return null;
  return (
    <div className="flex gap-2 justify-center sm:justify-end">
      <Link href="/admin" aria-label="Go to admin dashboard">
        <Button title="Admin panel">Admin</Button>
      </Link>
    </div>
  );
}
