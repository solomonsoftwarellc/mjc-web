"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  thumbnailVariant,
  type GalleryEntry,
} from "~/app/wedding/gallery-types";

const sha256 = async (text: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)),
    ),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");

export default function ManagePosts({
  slug,
  couple,
  passwordHash,
}: {
  slug: string;
  couple: string;
  passwordHash: string;
}) {
  const unlockedKey = `weddingAdmin:${slug}`;
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<GalleryEntry[] | null>(null);

  // Stay signed in for this browser tab, so a refresh does not ask again.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(unlockedKey) === passwordHash)
        setIsUnlocked(true);
    } catch {
      // Storage is blocked: the password is simply asked again.
    }
  }, [unlockedKey, passwordHash]);

  useEffect(() => {
    if (!isUnlocked) return;
    // shortcut: loads every post at once, page it if a gallery passes a few thousand
    return onSnapshot(
      query(
        collection(db, "weddings", slug, "gallery"),
        orderBy("timestamp", "desc"),
      ),
      (snapshot) => {
        setItems(
          snapshot.docs.map(
            (post) => ({ id: post.id, ...post.data() }) as GalleryEntry,
          ),
        );
      },
      (fetchError) => {
        console.error("Error fetching gallery:", fetchError);
        setError("The posts could not be loaded. Please refresh the page.");
      },
    );
  }, [isUnlocked, slug]);

  const unlock = async (event: React.FormEvent) => {
    event.preventDefault();
    if ((await sha256(password.trim())) !== passwordHash) {
      setError("That password is not right. Please try again.");
      return;
    }
    setError(null);
    setIsUnlocked(true);
    try {
      sessionStorage.setItem(unlockedKey, passwordHash);
    } catch {
      // Storage is blocked: still unlocked until the page is closed.
    }
  };

  const remove = async (item: GalleryEntry) => {
    if (!window.confirm("Remove this post from the gallery?")) return;
    const { id, ...post } = item;
    try {
      // Moved, not destroyed: the post is kept in weddings/<slug>/removed so
      // a mistaken removal can be put back. One batch, so it is never lost
      // halfway.
      await writeBatch(db)
        .set(doc(db, "weddings", slug, "removed", id), {
          ...post,
          removedAt: new Date().toISOString(),
        })
        .delete(doc(db, "weddings", slug, "gallery", id))
        .commit();
      setError(null);
    } catch (deleteError) {
      console.error("Error removing post:", deleteError);
      setError("That post could not be removed. Please try again.");
    }
  };

  if (!isUnlocked) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 font-sans">
        <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">
          <h1 className="text-center font-serif text-3xl">{couple}</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter the password to manage posts.
          </p>
          <form onSubmit={unlock} className="mt-8 grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 text-base"
                required
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="h-11 w-full">
              Continue
            </Button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 font-sans">
      <h1 className="font-serif text-3xl">{couple}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items === null
          ? "Loading posts..."
          : items.length === 0
            ? "No posts yet."
            : "Tap Remove under a post to take it out of the gallery."}
      </p>
      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items?.map((item) => {
          const preview =
            item.type === "image"
              ? thumbnailVariant(item.variants)
              : item.thumbnail;

          return (
            <li key={item.id} className="grid gap-2">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-muted text-sm text-muted-foreground">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "Video"
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {item.type === "video" ? "Video" : "Photo"}
                {item.name ? ` by ${item.name}` : ""}
              </p>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full"
                onClick={() => remove(item)}
              >
                Remove
              </Button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
