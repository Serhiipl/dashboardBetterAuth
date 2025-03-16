"use client";

import Link from "next/link";
import { createAuthClient } from "better-auth/react";
const { useSession } = createAuthClient();

import { Button } from "@/components/ui/button";
import SignOutButton from "@/components/signout-button";
// import { Session } from "@/auth";
// import { authClient } from "@/auth-client";

export default function Navbar() {
  const { data, isPending } = useSession();
  const session = data;
  if (isPending) return <div>Loading...</div>;
  return (
    <div className="sticky top-0 z-10 bg-slate-100">
      <nav className="flex justify-between items-center py-3 px-4 sticky top-0 bg-white shadow-md  max-w-6xl mx-auto xl:max-w-[90rem]">
        <Link href="/" className="text-xl font-bold">
          Better auth
        </Link>
        {!session ? (
          <div className="flex space-x-4">
            <Link href="/sign-in">
              <Button variant="default">Sign-In</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="default">Sign-Up</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <SignOutButton />
          </div>
        )}
      </nav>
    </div>
  );
}
