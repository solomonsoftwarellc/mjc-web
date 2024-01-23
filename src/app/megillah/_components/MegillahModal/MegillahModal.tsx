"use-client";

import React, { useEffect } from "react";
import { useCallback, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "~/components/ui/dialog";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Skeleton } from "~/components/ui/skeleton";
import { ArrowRightCircle, ArrowLeftCircle, XSquareIcon } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function MegillahModal({
  pdf,
  setPdf,
}: {
  pdf: string;
  setPdf: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [open, setOpen] = React.useState(!!pdf);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setOpen(!!pdf);
  }, [pdf]);

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
    setPageNumber(1);
  }

  return (
    <>
      <iframe
        src="https://drive.google.com/file/d/1GxE9jpVFEUPj_DS9LxnMNPrcFMsao7yS/preview"
        allowFullScreen
        allow="autoplay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 40,
        }}
        width={"100%"}
        height={"100%"}
        onLoad={() => {
          console.log("Loaded!");
        }}
      ></iframe>
      <Button
        className="absolute left-4 top-4 z-50"
        onClick={() => {
          setPdf(undefined);
        }}
      >
        <XSquareIcon className="mr-2 h-4 w-4" />
        Close
      </Button>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex flex-col items-center justify-center"
        style={{
          minHeight: window.innerHeight - 100,
        }}
      >
        <DialogHeader></DialogHeader>

        <div className="Example__container__document flex-1">
          <iframe
            src="https://drive.google.com/file/d/1GxE9jpVFEUPj_DS9LxnMNPrcFMsao7yS/preview"
            allowFullScreen
            allow="autoplay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 50,
            }}
          ></iframe>
        </div>

        <DialogFooter>
          <div className="flex flex-col">
            <p>
              Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
            </p>

            <div className="flex flex-row justify-between">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={previousPage}
              >
                <ArrowLeftCircle />
              </button>
              <button
                type="button"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
              >
                <ArrowRightCircle />
              </button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MegillahModal;

function MegillahModalSkeleton() {
  return <Skeleton className=" h-full w-full flex-1" />;
}
