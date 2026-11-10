import type { Metadata } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "firebaseConfig";
import type { Megillah } from "types";
import { parseReleaseDate } from "~/lib/utils";
import SiteShell, { PageTitle } from "~/components/SiteShell";
import MegillahItem from "./_components/MegillahItem/MegillahItem";
import TrackedPdfLink from "./_components/TrackedPdfLink";

// Serve from cache, but refresh within a minute so admin edits show up quickly.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Megillah",
  description:
    "Collection of magazines published by the Mashadi Youth Committee.",
};

type ResolvedMegillah = Megillah & {
  thumbnailUrl: string | null;
  pdfUrl: string | null;
};

async function resolveUrl(path: string | null | undefined) {
  if (!path) return null;
  try {
    return await getDownloadURL(ref(storage, path));
  } catch (error) {
    console.error(`Failed to resolve storage path "${path}":`, error);
    return null;
  }
}

async function getMegillahs(): Promise<ResolvedMegillah[]> {
  const snapshot = await getDocs(
    query(collection(db, "megillahs"), orderBy("issue", "desc")),
  );

  const megillahs = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...(data as Omit<Megillah, "id" | "releaseDate">),
      id: doc.id,
      releaseDate: parseReleaseDate(data.releaseDate),
    };
  });

  // Resolving on the server, in parallel, replaces one download-URL round trip
  // per item from every visitor's browser after hydration.
  return Promise.all(
    megillahs.map(async (megillah) => {
      const [thumbnailUrl, pdfUrl] = await Promise.all([
        resolveUrl(megillah.thumbnailPathOnFirebaseStorage),
        resolveUrl(megillah.pdfPathOnFirebaseStorage),
      ]);
      return { ...megillah, thumbnailUrl, pdfUrl };
    }),
  );
}

function Issue({
  megillah,
  priority,
  sizes,
}: {
  megillah: ResolvedMegillah;
  priority: boolean;
  sizes?: string;
}) {
  const item = (
    <MegillahItem megillah={megillah} priority={priority} sizes={sizes} />
  );

  return megillah.pdfUrl ? (
    <TrackedPdfLink
      href={megillah.pdfUrl}
      issue={megillah.issue}
      className="group block"
    >
      {item}
    </TrackedPdfLink>
  ) : (
    item
  );
}

export default async function MegillahPage() {
  const [latest, ...archive] = await getMegillahs();

  return (
    <SiteShell>
      <PageTitle eyebrow="Mashadi Youth Committee" title="Megillah">
        The magazine of our community, in photographs and words. Tap a cover to
        read the issue.
      </PageTitle>

      {latest && (
        <section aria-label="Latest issue" className="mx-auto max-w-xs">
          <p className="eyebrow mb-5 text-center text-brand">Latest issue</p>
          <Issue
            megillah={latest}
            priority
            sizes="(max-width: 640px) 80vw, 320px"
          />
        </section>
      )}

      {archive.length > 0 && (
        <section aria-label="Past issues" className="mt-20">
          <h2 className="eyebrow border-t border-border pt-8 text-center text-muted-foreground">
            Past issues
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:grid-cols-4">
            {archive.map((megillah, index) => (
              <Issue key={megillah.id} megillah={megillah} priority={index < 4} />
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
