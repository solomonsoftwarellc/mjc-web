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
  onSubmit: (megillah: Partial<Megillah>, thumbnail?: File, pdf?: File) => void;
  megillahToEdit?: Megillah | null;
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

  useEffect(() => {
    if (megillahToEdit) {
      setIssue(megillahToEdit.issue.toString());
      const date = megillahToEdit.releaseDate;
      setReleaseDate(date ? new Date(date).toISOString().substring(0, 10) : "");
    } else {
      setIssue("");
      setReleaseDate("");
    }
  }, [megillahToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const megillahData: Partial<Megillah> = {
      issue: parseInt(issue, 10),
      releaseDate: releaseDate ? new Date(releaseDate) : null,
    };
    onSubmit(megillahData, thumbnail ?? undefined, pdf ?? undefined);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {megillahToEdit ? "Edit Megillah" : "Add New Megillah"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="issue" className="text-right">
                Issue
              </label>
              <Input
                id="issue"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="col-span-3"
                type="number"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="releaseDate" className="text-right">
                Release Date
              </label>
              <Input
                id="releaseDate"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="col-span-3"
                type="date"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="thumbnail" className="text-right">
                Thumbnail
              </label>
              <Input
                id="thumbnail"
                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                className="col-span-3"
                type="file"
                accept="image/*"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="pdf" className="text-right">
                PDF
              </label>
              <Input
                id="pdf"
                onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
                className="col-span-3"
                type="file"
                accept="application/pdf"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {megillahToEdit ? "Save Changes" : "Create Megillah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
