"use client";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import csv from "csv-parser";
import fs from "fs";

const csvFilePath =
  "/Users/solomonbassalian/Documents/mjc/mjc-web/public/other/Megillah db - Sheet1.csv";

async function main() {
  const records = [];

  (await prisma.megillah.findMany()).forEach(async (megillah) => {
    if (megillah.issue > 90) {
      return;
    }

    await prisma.megillah.update({
      where: {
        id: megillah.id,
      },
      data: {
        pdfPath: null,
      },
    });
  });

  // fs.createReadStream(csvFilePath)
  //   .pipe(csv())
  //   .on("data", (row) => {
  //     // Transform row if necessary (e.g., parse dates, convert 'YES'/'NO' to boolean)
  //     const record = {
  //       issue: row["Issue #"],
  //       releaseDate: row["Release Date"] ? new Date(row["Release Date"]) : null,
  //       pageCount: row["Page Count"] ? parseInt(row["Page Count"]) : null,
  //       haveIt: row["Do we have it? "] === "YES",
  //       pdfFormat: row["PDF Format? "] === "YES",
  //       englishLink: row["English Link"],
  //       farsiLink: row["Farsi Link?"],
  //     };
  //     records.push(record);
  //   })
  //   .on("end", async () => {
  //     // Insert data into the database using Prisma
  //     for (const data of records) {
  //       if (!data.issue) continue;

  //       // await prisma.megillah.create({
  //       //   data: {
  //       //     issue: parseInt(data.issue),
  //       //     releaseDate: data.releaseDate,
  //       //     pdfPath: `/pdfs/${data.issue}`,
  //       //   },
  //       // });
  //     }

  //     console.log("CSV file successfully processed");
  //     await prisma.$disconnect();
  //   });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
