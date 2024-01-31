"use client";

import React from "react";
import MegillahItem from "../MegillahItem/MegillahItem";
import Link from "next/link";

function MegillaPageClient({
  megillahs,
}: {
  megillahs: {
    id: number;
    issue: number;
    releaseDate: Date | null;
    url: string | null;
    thumbnailPath: string | null;
  }[];
}) {

  return (
    <>
      <div className="container flex flex-col gap-12 px-4 py-8 ">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {megillahs.map((megillah) => (
            (
              megillah.url 
              ?  <Link target="_blank" href={megillah.url} key={megillah.id}>
                  <MegillahItem megillah={megillah} />
                </Link> : <MegillahItem megillah={megillah} key={megillah.id} />
            )    
          ))}
        </div>
      </div>
    </>
  );
}

export default MegillaPageClient;
