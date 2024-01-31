/*
  Warnings:

  - You are about to drop the column `iframe` on the `Megillah` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Megillah" DROP COLUMN "iframe",
ADD COLUMN     "url" TEXT;
