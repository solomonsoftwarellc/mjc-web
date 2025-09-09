"use client";

import { useState } from "react";
import type { Megillah } from "types";
import { Button } from "~/components/ui/button";
import MegillahForm from "./MegillahForm";
import Thumbnail from "./Thumbnail";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "firebaseConfig";

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
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Megillahs</h1>
        <Button onClick={handleAdd}>Add New Megillah</Button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Thumbnail
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Issue
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Release Date
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {megillahs.map((megillah) => (
              <tr key={megillah.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <Thumbnail
                    path={megillah.thumbnailPathOnFirebaseStorage}
                    alt={`Thumbnail for issue ${megillah.issue}`}
                  />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {megillah.issue}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {megillah.releaseDate
                    ? new Date(megillah.releaseDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(megillah)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(megillah.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MegillahForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        megillahToEdit={megillahToEdit}
      />
    </div>
  );
}
