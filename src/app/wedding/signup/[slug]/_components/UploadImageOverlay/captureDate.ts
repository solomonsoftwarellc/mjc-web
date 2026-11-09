/** EXIF never sits deeper than the first segments of a JPEG. */
const HEADER_BYTES = 256 * 1024;
const EXIF_IFD_TAG = 0x8769;
const DATE_TIME_ORIGINAL_TAG = 0x9003;

function readTiffDate(view: DataView, tiff: number): Date | null {
  const little = view.getUint16(tiff) === 0x4949;
  const u16 = (offset: number) => view.getUint16(tiff + offset, little);
  const u32 = (offset: number) => view.getUint32(tiff + offset, little);

  /** Offset of the 12-byte entry for `tag` in the directory at `ifd`. */
  const findEntry = (ifd: number, tag: number) => {
    const count = u16(ifd);
    for (let i = 0; i < count; i++) {
      const entry = ifd + 2 + i * 12;
      if (u16(entry) === tag) return entry;
    }
    return null;
  };

  const exifPointer = findEntry(u32(4), EXIF_IFD_TAG);
  if (exifPointer === null) return null;
  const dateEntry = findEntry(u32(exifPointer + 8), DATE_TIME_ORIGINAL_TAG);
  if (dateEntry === null) return null;

  const textAt = tiff + u32(dateEntry + 8);
  let text = "";
  for (let i = 0; i < 19; i++) text += String.fromCharCode(view.getUint8(textAt + i));

  const match = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(text);
  if (!match) return null;
  const [year, month, day, hour, minute, second] = match.slice(1).map(Number);
  // EXIF records wall-clock time with no zone; the guest's phone is in the
  // same zone as the camera that took it, so local time is the right reading.
  const date = new Date(year!, month! - 1, day, hour, minute, second);

  // A camera with an unset clock is worse than no date at all.
  const isPlausible =
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() >= 2000 &&
    date.getTime() < Date.now() + 24 * 60 * 60 * 1000;
  return isPlausible ? date : null;
}

/**
 * When a photo was actually taken, read from its EXIF data.
 *
 * `File.lastModified` is often the moment the photo was saved or picked, not
 * shot, which would file last night's photos under today. Returns null for
 * videos, non-JPEGs and anything unreadable, so callers fall back to that.
 */
export async function readCaptureDate(file: File): Promise<Date | null> {
  try {
    const view = new DataView(await file.slice(0, HEADER_BYTES).arrayBuffer());
    if (view.getUint16(0) !== 0xffd8) return null; // not a JPEG

    let offset = 2;
    while (offset + 10 < view.byteLength) {
      const marker = view.getUint16(offset);
      if ((marker & 0xff00) !== 0xff00) return null;
      // APP1 segment whose payload starts with "Exif"
      if (marker === 0xffe1 && view.getUint32(offset + 4) === 0x45786966) {
        return readTiffDate(view, offset + 10);
      }
      offset += 2 + view.getUint16(offset + 2);
    }
  } catch {
    // Truncated or malformed header: out-of-range reads land here.
  }
  return null;
}
