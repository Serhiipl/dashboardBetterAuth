import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
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
          <div className="flex items-center gap-2">Log out</div>
        )}
      </nav>
    </div>
  );
}
