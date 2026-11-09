import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="eyebrow border-t border-border px-6 py-8 text-center text-muted-foreground">
      United Mashadi Jewish Community of America
    </footer>
  );
}

/** The frame shared by the public pages: wordmark, page width, footer. */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-2xl tracking-[0.3em]" aria-label="MJC home">
          MJC
        </Link>
        <Link href="/" className="eyebrow py-2 text-muted-foreground hover:text-foreground">
          Home
        </Link>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

/** Title block that opens each public page. */
export function PageTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl pb-14 pt-10 text-center sm:pt-16">
      <p className="eyebrow text-muted-foreground">{eyebrow}</p>
      <h1 className="mt-4 text-5xl sm:text-6xl">{title}</h1>
      <div className="mx-auto my-7 h-px w-12 bg-gold" aria-hidden="true" />
      {children && (
        <p className="text-xl leading-relaxed text-muted-foreground">
          {children}
        </p>
      )}
    </div>
  );
}
