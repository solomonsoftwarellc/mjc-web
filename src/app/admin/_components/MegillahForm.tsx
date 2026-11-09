"use client";

import { useState, useEffect } from "react";
import type { Megillah } from "types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";

interface MegillahFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    megillah: Partial<Megillah>,
    thumbnail?: File,
    pdf?: File,
  ) => Promise<void> | void;
  megillahToEdit?: Megillah | null;
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function MegillahForm({
  isOpen,
  onClose,
  onSubmit,
  megillahToEdit,
}: MegillahFormProps) {
  const [issue, setIssue] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (megillahToEdit) {
      setIssue(megillahToEdit.issue.toString());
      const date = megillahToEdit.releaseDate;
      setReleaseDate(date ? new Date(date).toISOString().substring(0, 10) : "");
    } else {
      setIssue("");
      setReleaseDate("");
    }
    // The file pickers remount empty each time the form opens, so the chosen
    // files must reset with them - otherwise the previous issue's cover and
    // PDF would be uploaded onto this one.
    setThumbnail(null);
    setPdf(null);
  }, [megillahToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const megillahData: Partial<Megillah> = {
      issue: parseInt(issue, 10),
      // Save as an ISO string (what the site reads), at noon UTC so the
      // calendar day is the same in every US time zone.
      releaseDate: releaseDate
        ? new Date(`${releaseDate}T12:00:00.000Z`).toISOString()
        : null,
    };
    setIsSaving(true);
    try {
      await onSubmit(megillahData, thumbnail ?? undefined, pdf ?? undefined);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const keepHint = megillahToEdit ? "Leave empty to keep the current file." : undefined;
  const fileInput = "h-11 cursor-pointer py-2 file:mr-3 file:cursor-pointer";

  return (
    <Dialog open={isOpen} onOpenChange={isSaving ? undefined : onClose}>
      <DialogContent className="font-sans">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-normal">
            {megillahToEdit ? `Edit issue ${megillahToEdit.issue}` : "Add an issue"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="issue" label="Issue number">
                <Input
                  id="issue"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="h-11 text-base"
                  type="number"
                  inputMode="numeric"
                  required
                />
              </Field>
              <Field id="releaseDate" label="Release date">
                <Input
                  id="releaseDate"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="h-11 text-base"
                  type="date"
                />
              </Field>
            </div>
            <Field id="thumbnail" label="Cover image" hint={keepHint}>
              <Input
                id="thumbnail"
                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                className={fileInput}
                type="file"
                accept="image/*"
              />
            </Field>
            <Field id="pdf" label="Magazine PDF" hint={keepHint}>
              <Input
                id="pdf"
                onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
                className={fileInput}
                type="file"
                accept="application/pdf"
              />
            </Field>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : megillahToEdit
                  ? "Save changes"
                  : "Add issue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
