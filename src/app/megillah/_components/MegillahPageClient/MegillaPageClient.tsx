"use client";

import React from "react";
import MegillahItem from "../MegillahItem/MegillahItem";
import type { Megillah } from "types";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "firebaseConfig";

function MegillaPageClient({ megillahs }: { megillahs: Megillah[] }) {
  const openPdf = async (pdfPath: string) => {
    const storageRef = ref(storage, pdfPath);
    try {
      const url = await getDownloadURL(storageRef);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error getting PDF URL", error);
    }
  };

  return (
    <>
      <div className="container flex flex-col gap-12 px-4 py-8 ">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {megillahs.map((megillah) => {
            if (megillah.pdfPathOnFirebaseStorage) {
              return (
                <div
                  key={megillah.id}
                  onClick={() =>
                    openPdf(megillah.pdfPathOnFirebaseStorage!)
                  }
                  className="cursor-pointer"
                >
                  <MegillahItem megillah={megillah} />
                </div>
              );
            } else {
              return <MegillahItem megillah={megillah} key={megillah.id} />;
            }
          })}
        </div>
      </div>
    </>
  );
}

export default MegillaPageClient;
