"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import type { Megillah } from "types";
import { Button } from "~/components/ui/button";
import MegillahForm from "./MegillahForm";
import Thumbnail from "./Thumbnail";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "firebaseConfig";

export default function AdminDashboard({
  initialMegillahs,
}: {
  initialMegillahs: Megillah[];
}) {
  const [megillahs, setMegillahs] = useState<Megillah[]>(initialMegillahs);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [megillahToEdit, setMegillahToEdit] = useState<Megillah | null>(null);

  const handleAdd = () => {
    setMegillahToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (megillah: Megillah) => {
    setMegillahToEdit(megillah);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this megillah?"))
      return;

    try {
      const megillahToDelete = megillahs.find((m) => m.id === id);
      if (megillahToDelete?.thumbnailPathOnFirebaseStorage) {
        const thumbnailRef = ref(
          storage,
          megillahToDelete.thumbnailPathOnFirebaseStorage,
        );
        await deleteObject(thumbnailRef).catch((e) =>
          console.error("Failed to delete thumbnail:", e),
        );
      }
      if (megillahToDelete?.pdfPathOnFirebaseStorage) {
        const pdfRef = ref(storage, megillahToDelete.pdfPathOnFirebaseStorage);
        await deleteObject(pdfRef).catch((e) =>
          console.error("Failed to delete PDF:", e),
        );
      }

      await deleteDoc(doc(db, "megillahs", id));
      setMegillahs(megillahs.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error deleting megillah:", error);
      alert(
        "Failed to delete megillah. Please check the console for more details.",
      );
    }
  };

  const handleFormSubmit = async (
    megillahData: Partial<Megillah>,
    thumbnail?: File,
    pdf?: File,
  ) => {
    try {
      let thumbnailPath =
        megillahToEdit?.thumbnailPathOnFirebaseStorage ?? null;
      if (thumbnail) {
        if (megillahToEdit?.thumbnailPathOnFirebaseStorage) {
          await deleteObject(
            ref(storage, megillahToEdit.thumbnailPathOnFirebaseStorage),
          ).catch((e) => console.error("Failed to delete old thumbnail:", e));
        }
        thumbnailPath = `thumbnails/${Date.now()}_${thumbnail.name}`;
        const thumbnailRef = ref(storage, thumbnailPath);
        await uploadBytes(thumbnailRef, thumbnail);
      }

      let pdfPath = megillahToEdit?.pdfPathOnFirebaseStorage ?? null;
      if (pdf) {
        if (megillahToEdit?.pdfPathOnFirebaseStorage) {
          await deleteObject(
            ref(storage, megillahToEdit.pdfPathOnFirebaseStorage),
          ).catch((e) => console.error("Failed to delete old PDF:", e));
        }
        pdfPath = `pdfs/${Date.now()}_${pdf.name}`;
        const pdfRef = ref(storage, pdfPath);
        await uploadBytes(pdfRef, pdf);
      }

      const dataToSave = {
        ...megillahData,
        thumbnailPathOnFirebaseStorage: thumbnailPath,
        pdfPathOnFirebaseStorage: pdfPath,
      };

      if (megillahToEdit) {
        // Update
        const docRef = doc(db, "megillahs", megillahToEdit.id);
        await updateDoc(docRef, dataToSave);
        setMegillahs(
          megillahs.map((m) =>
            m.id === megillahToEdit.id ? { ...m, ...dataToSave, id: m.id } : m,
          ),
        );
      } else {
        // Add - using issue number as document ID
        if (!megillahData.issue) {
          alert("Issue number is required to create a new megillah.");
          return;
        }
        const docId = megillahData.issue.toString();
        const docRef = doc(db, "megillahs", docId);
        await setDoc(docRef, dataToSave);
        setMegillahs([
          { ...dataToSave, id: docId } as unknown as Megillah,
          ...megillahs,
        ]);
      }
    } catch (error) {
      console.error("Error saving megillah:", error);
    } finally {
      setIsFormOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="eyebrow text-muted-foreground">MJC admin</p>
          <h1 className="mt-2 font-serif text-4xl">Megillah issues</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/megillah">View site</Link>
          </Button>
          {/* AuthProvider sees the sign-out and sends the browser to the login page. */}
          <Button variant="outline" onClick={() => void signOut(auth)}>
            Sign out
          </Button>
          <Button onClick={handleAdd}>Add issue</Button>
        </div>
      </header>

      {megillahs.length === 0 ? (
        <p className="py-20 text-center font-serif text-xl italic text-muted-foreground">
          No issues yet. Add the first one.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {megillahs.map((megillah) => (
            <li
              key={megillah.id}
              className="flex flex-wrap items-center gap-x-5 gap-y-3 py-4"
            >
              <Thumbnail
                path={megillah.thumbnailPathOnFirebaseStorage}
                alt={`Cover of issue ${megillah.issue}`}
              />
              <div className="min-w-0 flex-1">
                <p className="font-serif text-2xl">Issue {megillah.issue}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {megillah.releaseDate
                    ? new Date(megillah.releaseDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No release date"}
                  {!megillah.pdfPathOnFirebaseStorage && " · No PDF"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleEdit(megillah)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDelete(megillah.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <MegillahForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        megillahToEdit={megillahToEdit}
      />
    </div>
  );
}
