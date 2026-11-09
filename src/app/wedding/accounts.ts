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
  /**
   * The couple's first names, set in script on the cover. Its presence also
   * opts the wedding into the memories experience (cover, camera);
   * weddings without it keep the original gallery page.
   */
  couple?: string;
  /** Shown instead of `date` where a multi-day celebration needs a range. */
  dateLabel?: string;
};

export const Accounts = {
  "david-charlotte": {
    name: "Charlotte & David Kalaty's Wedding",
    slug: "david-charlotte",
    date: "January 19, 2025",
    textColor: "#b8966f",
    backgroundColor: "#efe6dd",
    displayWedding: true,
    showUpload: false,
  },
  "lea-eman": {
    name: "Lea & Emanuel Mordekhai's Wedding",
    slug: "lea-eman",
    date: "March 23rd, 2025",
    textColor: "#004d00",
    backgroundColor: "#ffffff",
    displayWedding: true,
    showUpload: false,
  },
  "test-slug": {
    name: "Test Slug",
    slug: "test-slug",
    date: "February 16, 2025",
    textColor: "#b8966f",
    backgroundColor: "#efe6dd",
    displayWedding: false,
    showUpload: false,
  },
  "another-one": {
    name: "Another One",
    slug: "another-one",
    date: "February 16, 2025",
    textColor: "#b8966f",
    backgroundColor: "#efe6dd",
    displayWedding: false,
    showUpload: false,
  },
  "another-one2": {
    name: "Another One 2",
    slug: "another-one2",
    date: "February 16, 2025",
    textColor: "#b8966f",
    backgroundColor: "#efe6dd",
    displayWedding: false,
    showUpload: false,
  },
  "julian-shellie": {
    name: "Shellie & Julian Hajibay's Wedding",
    slug: "julian-shellie",
    date: "February 16, 2025",
    textColor: "#ca9a2f",
    backgroundColor: "#fffff0",
    displayWedding: false,
    showUpload: false,
  },
  "gabrielle-noah": {
    name: "Gabrielle & Noah Namdar's Wedding",
    slug: "gabrielle-noah",
    // Kept as a single day: the /wedding index sorts by parsing this string.
    date: "November 15, 2026",
    dateLabel: "November 12 - 15, 2026",
    couple: "Gabrielle & Noah",
    // The palm green and paper white of the couple's invitation suite.
    textColor: "#36502e",
    backgroundColor: "#fefdfb",
    displayWedding: true,
    showUpload: true,
  },
} satisfies Record<string, WeddingAccount>;

export type WeddingSlug = keyof typeof Accounts;

export const weddingSlugs = Object.keys(Accounts) as WeddingSlug[];

/** Weddings listed on the /wedding index, newest first. */
export const displayedWeddings: WeddingAccount[] = Object.values(Accounts)
  .filter((account) => account.displayWedding)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getAccount(slug: string): WeddingAccount | undefined {
  return (Accounts as Record<string, WeddingAccount>)[slug];
}
