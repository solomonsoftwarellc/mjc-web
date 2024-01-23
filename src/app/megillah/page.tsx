import { api } from "~/trpc/server";
import MegillaPageClient from "./_components/MegillahPageClient/MegillaPageClient";
import Link from "next/link";

export default async function Megillah() {
  const megillahs = await api.megillah.index.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex w-full flex-1 flex-row items-center justify-start pl-4 pr-4 pt-4">
        <Link
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4  hover:bg-white/20 "
          href="/"
        >
          <h3 className="text-2xl font-bold">Home</h3>
        </Link>
      </div>
      <MegillaPageClient megillahs={megillahs} />
    </main>
  );
}
