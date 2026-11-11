import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAccount } from "../../../accounts";
import ManagePosts from "./ManagePosts";

/**
 * SHA-256 of each wedding's admin password (the slug plus the wedding dates).
 * A wedding without an entry here has no admin page.
 */
const passwordHashes: Record<string, string> = {
  "gabrielle-noah":
    "0313898f30df2a88cd4873e74327f12eab3b54ca2b4723ab11305e5cde80e5eb",
};

// Nothing links here; keep it out of search results too.
export const metadata: Metadata = {
  title: "Manage posts",
  robots: { index: false, follow: false },
};

export default function WeddingAdminPage({
  params,
}: {
  params: { slug: string };
}) {
  const account = getAccount(params.slug);
  const passwordHash = passwordHashes[params.slug];

  if (!account || !passwordHash) {
    notFound();
  }

  return (
    <ManagePosts
      slug={params.slug}
      couple={account.couple}
      passwordHash={passwordHash}
    />
  );
}
