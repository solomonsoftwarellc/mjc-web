import { PrismaClient } from "@prisma/client";
import { useState } from "react";
import { Document, Outline, Page, pdfjs } from "react-pdf";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { unstable_noStore as noStore } from "next/cache";
import MegillahItem from "./_components/MegillahItem/MegillahItem";
import MegillaPageClient from "./_components/MegillahPageClient/MegillaPageClient";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const prisma = new PrismaClient();

export default async function Megillah() {
  const megillahs = await api.megillah.index.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <MegillaPageClient megillahs={megillahs} />
    </main>
  );
}
