import { db } from "firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { Megillah } from "types";
import AdminDashboard from "./_components/AdminDashboard";

export default async function AdminPage() {
  const megillahsCollection = collection(db, "megillahs");
  const q = query(megillahsCollection, orderBy("issue", "desc"));
  const querySnapshot = await getDocs(q);
  const megillahs: Megillah[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const releaseDate = data.releaseDate
      ? new Date(data.releaseDate as string)
      : null;
    megillahs.push({
      ...(data as Omit<Megillah, "id" | "releaseDate">),
      id: doc.id,
      releaseDate,
    });
  });

  return <AdminDashboard initialMegillahs={megillahs} />;
}
