import Link from "next/link";
import SiteShell, { PageTitle } from "~/components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <PageTitle eyebrow="Error 404" title="Page not found">
        The page you are looking for has moved or never existed.
      </PageTitle>
      <p className="text-center">
        <Link
          href="/"
          className="eyebrow inline-block rounded-full border border-foreground px-8 py-4"
        >
          Back to the home page
        </Link>
      </p>
    </SiteShell>
  );
}
