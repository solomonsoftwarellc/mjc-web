import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome to <br></br>
          the <span className="text-[hsl(280,100%,70%)]">MJC</span>
          <br></br>
          Official Website
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://kanissanews.com/"
          >
            <h3 className="text-2xl font-bold">Kanissa News →</h3>
            <div className="text-lg">
              Weekly newsletter featuring prayer times and events of the United
              Mashadi Jewish Community of America.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/raffle"
          >
            <h3 className="text-2xl font-bold">Watch Raffle →</h3>
            <div className="text-lg">
              Donate as little as $1 for a chance to win a Rolex watch!
              Authorize a pre-donation from $1-$550, get a unique random number
              as your donation amount, and you could win big.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/megillah"
          >
            <h3 className="text-2xl font-bold">Megillah →</h3>
            <div className="text-lg">
              Collection of magazines published by the Mashadi Youth Committee,
              featuring photo and written content related to the United Mashadi
              Jewish Community of America.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/wedding"
          >
            <h3 className="text-2xl font-bold">Weddings →</h3>
            <div className="text-lg">
              Explore beautiful weddings from our community. View galleries and
              celebrate with us.
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
