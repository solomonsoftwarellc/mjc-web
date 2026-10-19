import { db } from "firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { Megillah } from "types";
import { parseReleaseDate } from "~/lib/utils";
import AdminDashboard from "./_components/AdminDashboard";

// Admin must always reflect the database; never serve a cached build.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const megillahsCollection = collection(db, "megillahs");
  const q = query(megillahsCollection, orderBy("issue", "desc"));
  const querySnapshot = await getDocs(q);
  const megillahs: Megillah[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const releaseDate = parseReleaseDate(data.releaseDate);
    megillahs.push({
      ...(data as Omit<Megillah, "id" | "releaseDate">),
      id: doc.id,
      releaseDate,
    });
  });

  return <AdminDashboard initialMegillahs={megillahs} />;
}
