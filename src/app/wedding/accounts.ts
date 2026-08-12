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
    date: "November 15, 2026",
    // Sampled from the shell monogram: its warm sand accent is #d0b8a0, which
    // only reaches 1.9:1 against the page and is unreadable as text. This is
    // that same hue taken deeper, landing at 4.52:1 on the ivory below - the
    // warmest background that still clears WCAG AA for the photo captions.
    textColor: "#8a6a4d",
    backgroundColor: "#faf4ec",
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
