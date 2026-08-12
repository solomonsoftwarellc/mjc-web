import Link from "next/link";
import type { Metadata } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "firebaseConfig";
import type { Megillah } from "types";
import MegillahItem from "./_components/MegillahItem/MegillahItem";

// Issues change a few times a year; serve from cache and refresh in the
// background rather than re-querying Firestore on every request.
export const revalidate = 3600;

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
      releaseDate: data.releaseDate
        ? new Date(data.releaseDate as string)
        : null,
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

export default async function MegillahPage() {
  const megillahs = await getMegillahs();

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex w-full flex-row items-center justify-start px-4 pt-4">
        <Link
          className="rounded-xl bg-white/10 px-4 py-3 text-2xl font-bold transition-colors hover:bg-white/20"
          href="/"
        >
          Home
        </Link>
      </div>

      <div className="container flex flex-col gap-12 px-4 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {megillahs.map((megillah, index) =>
            megillah.pdfUrl ? (
              <a
                key={megillah.id}
                href={megillah.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <MegillahItem megillah={megillah} priority={index < 4} />
              </a>
            ) : (
              <MegillahItem
                key={megillah.id}
                megillah={megillah}
                priority={index < 4}
              />
            ),
          )}
        </div>
      </div>
    </main>
  );
}
