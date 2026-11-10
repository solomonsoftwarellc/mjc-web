import Link from "next/link";
import { SiteFooter } from "~/components/SiteShell";

const links = [
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
  {
    title: "Branches of Bracha",
    href: "https://branchesofbracha.com/",
    external: true,
    description:
      "Donate as little as $1 for a chance to win a Rolex watch! Authorize a pre-donation from $1-$550, get a unique random number as your donation amount, and you could win big.",
  },
  {
    title: "Kanissa News",
    href: "https://kanissanews.com/",
    external: true,
    description:
      "Weekly newsletter featuring prayer times and events of the United Mashadi Jewish Community of America.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-24 pt-20 sm:pt-28">
        <div className="text-center">
          <p className="eyebrow text-muted-foreground">Welcome to the</p>
          <h1 className="mt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/umjca-logo.svg"
              alt="UMJCA"
              width={925}
              height={714}
              className="mx-auto h-auto w-56 sm:w-64"
            />
          </h1>
          <div className="mx-auto my-8 h-px w-14 bg-brand" aria-hidden="true" />
          <p className="text-2xl italic leading-snug sm:text-3xl">
            United Mashadi Jewish
            <br />
            Community of America
          </p>
        </div>

        <nav aria-label="Sections" className="mt-16 border-t border-border">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-start gap-6 border-b border-border py-8"
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <div className="flex-1">
                <h2 className="text-3xl">{link.title}</h2>
                <p className="mt-2 text-lg leading-relaxed text-muted-foreground">
                  {link.description}
                </p>
                {link.external && (
                  <p className="eyebrow mt-4 text-muted-foreground">
                    {new URL(link.href).hostname}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </p>
                )}
              </div>
              <span
                aria-hidden="true"
                className="pt-1 text-2xl text-brand transition-transform duration-300 group-hover:translate-x-1"
              >
                {link.external ? "↗" : "→"}
              </span>
            </Link>
          ))}
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
