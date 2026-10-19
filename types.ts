export type Megillah = {
  id: string;
  issue: number;
  releaseDate: Date | string | null;
  url: string | null;
  thumbnailPath: string | null;
  thumbnailPathOnFirebaseStorage: string | null;
  pdfPathOnFirebaseStorage?: string | null;
};
