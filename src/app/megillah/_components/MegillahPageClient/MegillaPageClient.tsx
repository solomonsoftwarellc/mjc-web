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
    iframe: string | null;
    thumbnailPath: string | null;
  }[];
}) {
  const [iframe, setIframe] = useState<string | null>(null);

  return (
    <>
      <div className="container flex flex-col gap-12 px-4 py-8 ">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {megillahs.map((megillah) => (
            <button
              key={megillah.id}
              onClick={() => {
                setIframe(megillah.iframe);
              }}
              disabled={!megillah.iframe}
            >
              <MegillahItem megillah={megillah} />
            </button>
          ))}
        </div>
      </div>
      {iframe && <MegillahModal iframe={iframe} setIframe={setIframe} />}
    </>
  );
}

export default MegillaPageClient;
