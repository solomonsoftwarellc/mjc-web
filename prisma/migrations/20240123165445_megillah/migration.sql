-- CreateTable
CREATE TABLE "Megillah" (
    "id" SERIAL NOT NULL,
    "issue" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "pdfPath" TEXT,

    CONSTRAINT "Megillah_pkey" PRIMARY KEY ("id")
);
