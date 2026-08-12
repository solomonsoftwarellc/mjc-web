export type VideoStatus =
  | {
      state?: string;
      errorReasonCode?: string;
      errorReasonText?: string;
    }
  | string;

type BaseGalleryDoc = {
  name: string;
  fileName: string;
  timestamp: string;
  type: "image" | "video";
};

export type GalleryImageDoc = BaseGalleryDoc & {
  type: "image";
  cfImageId: string;
  variants: string[];
};

export type GalleryVideoDoc = BaseGalleryDoc & {
  type: "video";
  videoUid: string;
  status: VideoStatus;
  thumbnail?: string | null;
};

export type GalleryDoc = GalleryImageDoc | GalleryVideoDoc;

/** A gallery document paired with its Firestore id, used as the React key. */
export type GalleryEntry = GalleryDoc & { id: string };

export type ImageWithMetadata = {
  file: File;
  timestamp?: Date;
};

export type VideoWithMetadata = {
  file: File;
  timestamp?: Date;
  duration?: number;
};

/**
 * Cloudflare Images serves one URL per configured variant, e.g.
 * `https://imagedelivery.net/<hash>/<id>/public`. The grid only ever paints a
 * few hundred CSS pixels, so prefer a small variant when the account has one
 * configured and fall back to whatever the upload recorded.
 */
export function pickVariant(
  variants: string[] | undefined,
  preferred: string[],
): string | undefined {
  if (!variants?.length) return undefined;

  for (const name of preferred) {
    const match = variants.find((url) => url.endsWith(`/${name}`));
    if (match) return match;
  }

  return variants[0];
}

export const thumbnailVariant = (variants: string[] | undefined) =>
  pickVariant(variants, ["thumbnail", "small", "preview", "public"]);

export const fullVariant = (variants: string[] | undefined) =>
  pickVariant(variants, ["public", "large", "original"]);
