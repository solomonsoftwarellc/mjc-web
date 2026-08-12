import Link from "next/link";

const links = [
  {
    title: "Kanissa News",
    href: "https://kanissanews.com/",
    external: true,
    description:
      "Weekly newsletter featuring prayer times and events of the United Mashadi Jewish Community of America.",
  },
  {
    title: "Branches of Bracha",
    href: "https://branchesofbracha.com/",
    external: true,
    description:
      "Donate as little as $1 for a chance to win a Rolex watch! Authorize a pre-donation from $1-$550, get a unique random number as your donation amount, and you could win big.",
  },
  {
    title: "Megillah",
    href: "/megillah",
    external: false,
    description:
      "Collection of magazines published by the Mashadi Youth Committee, featuring photo and written content related to the United Mashadi Jewish Community of America.",
  },
  {
    title: "Wedding Pictures",
    href: "/wedding",
    external: false,
    description:
      "Explore beautiful weddings from our community. View galleries and celebrate with us.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome to
          <br />
          the <span className="text-[hsl(280,100%,70%)]">MJC</span>
          <br />
          Official Website
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {links.map((link) => (
            <Link
              key={link.href}
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 transition-colors hover:bg-white/20"
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <h2 className="text-2xl font-bold">{link.title} →</h2>
              <p className="text-lg">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
