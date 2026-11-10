export type WeddingAccount = {
  name: string;
  slug: string;
  date: string;
  textColor: string;
  backgroundColor: string;
  /** Show this wedding in the /wedding index. */
  displayWedding: boolean;
  /** Allow guests to upload photos and videos to this gallery. */
  showUpload: boolean;
  /** The first names of the couple, set in script on the cover. */
  couple: string;
  /** Path of the monogram shown on the cover; omitted for test weddings. */
  logo?: string;
  /** Shown instead of `date` where a multi-day celebration needs a range. */
  dateLabel?: string;
  /** ISO dates (YYYY-MM-DD) of each day of the celebration, for the day tabs. */
  eventDays?: string[];
};

export const Accounts = {
  "david-charlotte": {
    name: "Charlotte & David Kalaty's Wedding",
    slug: "david-charlotte",
    couple: "Charlotte & David",
    logo: "/wedding/david-charlotte.png",
    date: "January 19, 2025",
    // The wreath is a gold-tan (#b09068) that only reaches 2.6:1 as text, so
    // the ink is that hue taken deeper: 6.0:1 on a champagne paper.
    textColor: "#6e5a40",
    backgroundColor: "#f6efe6",
    displayWedding: true,
    showUpload: false,
  },
  "lea-eman": {
    name: "Lea & Emanuel Mordekhai's Wedding",
    slug: "lea-eman",
    couple: "Lea & Emanuel",
    logo: "/wedding/lea-eman.png",
    date: "March 23rd, 2025",
    // The charcoal-olive of the pen-and-ink crest itself: 10.1:1.
    textColor: "#404030",
    backgroundColor: "#fbfaf6",
    displayWedding: true,
    showUpload: false,
  },
  "test-slug": {
    name: "Test Slug",
    slug: "test-slug",
    couple: "Test & Slug",
    date: "February 16, 2025",
    textColor: "#b8966f",
    backgroundColor: "#efe6dd",
    displayWedding: false,
    showUpload: false,
  },
  "another-one": {
    name: "Another One",
    slug: "another-one",
    couple: "Another & One",
    date: "February 16, 2025",
    textColor: "#b8966f",
    backgroundColor: "#efe6dd",
    displayWedding: false,
    showUpload: false,
  },
  "another-one2": {
    name: "Another One 2",
    slug: "another-one2",
    couple: "Another & Two",
    date: "February 16, 2025",
    textColor: "#b8966f",
    backgroundColor: "#efe6dd",
    displayWedding: false,
    showUpload: false,
  },
  "julian-shellie": {
    name: "Shellie & Julian Hajibay's Wedding",
    slug: "julian-shellie",
    couple: "Shellie & Julian",
    logo: "/wedding/julian-shellie.png",
    date: "February 16, 2025",
    // The gold of the monogram (#c89830) is 2.6:1 as text; this antique gold
    // keeps the hue at 6.1:1 on ivory.
    textColor: "#7a5c1c",
    backgroundColor: "#fffdf5",
    displayWedding: false,
    showUpload: false,
  },
  "gabrielle-noah": {
    name: "Gabrielle & Noah Namdar's Wedding",
    slug: "gabrielle-noah",
    // Kept as a single day: the /wedding index sorts by parsing this string.
    date: "November 15, 2026",
    dateLabel: "November 12 - 15, 2026",
    eventDays: ["2026-11-12", "2026-11-13", "2026-11-14", "2026-11-15"],
    couple: "Gabrielle & Noah",
    logo: "/wedding/gabrielle-noah.svg",
    // The palm green and paper white of the couple's invitation suite.
    textColor: "#36502e",
    backgroundColor: "#fefdfb",
    displayWedding: true,
    showUpload: true,
  },
} satisfies Record<string, WeddingAccount>;

export type WeddingSlug = keyof typeof Accounts;

export const weddingSlugs = Object.keys(Accounts) as WeddingSlug[];

/**
 * Dates are written for people ("March 23rd, 2025"), and the ordinal suffix
 * makes Date return NaN - which silently scrambles a sort.
 */
const dateValue = (date: string) =>
  new Date(date.replace(/(d)(st|nd|rd|th)/, "$1")).getTime();

/** Weddings listed on the /wedding index, newest first. */
export const displayedWeddings: WeddingAccount[] = Object.values(Accounts)
  .filter((account) => account.displayWedding)
  .sort((a, b) => dateValue(b.date) - dateValue(a.date));

export function getAccount(slug: string): WeddingAccount | undefined {
  return (Accounts as Record<string, WeddingAccount>)[slug];
}
