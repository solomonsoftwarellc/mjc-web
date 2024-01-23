/*
  Warnings:

  - You are about to drop the column `pdfPath` on the `Megillah` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Megillah" RENAME COLUMN "pdfPath" TO "iframe";
