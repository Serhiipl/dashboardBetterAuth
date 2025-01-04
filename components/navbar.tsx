import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Navbar() {
  return (
    <div className="sticky top-0 z-10 bg-slate-100">
      <nav className="flex justify-between items-center py-3 px-4 sticky top-0 bg-white shadow-md  max-w-6xl mx-auto xl:max-w-[90rem]">
        <Link href="/" className="text-xl font-bold">
          Better auth
        </Link>
        <div className="flex space-x-4">
          <Link href="/sign-in">
            <Button variant="default">Sign-In</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="default">Sign-Up</Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}
