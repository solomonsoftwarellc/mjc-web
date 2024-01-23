"use client";

import React, { useState } from "react";
import MegillahItem from "../MegillahItem/MegillahItem";
import MegillahModal from "../MegillahModal/MegillahModal";

function MegillaPageClient({
  megillahs,
}: {
  megillahs: {
    id: number;
    issue: number;
    releaseDate: Date | null;
    pdfPath: string | null;
    thumbnailPath: string | null;
  }[];
}) {
  const [pdf, setPdf] = useState<string>();

  return (
    <>
      <div className="container flex flex-col gap-12 px-4 py-16 ">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {megillahs.map((megillah) => (
            <button
              key={megillah.id}
              onClick={() => {
                setPdf(`${megillah.pdfPath}.pdf`);
              }}
              disabled={!megillah.pdfPath}
            >
              <MegillahItem megillah={megillah} />
            </button>
          ))}
        </div>
      </div>
      {pdf && <MegillahModal pdf={pdf}  setPdf={setPdf}/>}
    </>
  );
}

export default MegillaPageClient;
