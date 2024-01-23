"use-client";

import React, { useEffect } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "~/components/ui/button";
import { XSquareIcon } from "lucide-react";

function MegillahModal({
  iframe,
  setIframe,
}: {
  iframe: string;
  setIframe: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [documentLoaded, setDocumentLoaded] = React.useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Function to handle the "Escape" keypress
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" || event.keyCode === 27) {
      // Perform the action you want when the "Escape" key is pressed
      setIframe(null);
    }
  };

  // Add the event listener when the component mounts
  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  function onIframeLoadSuccess() {
    setDocumentLoaded(true);
  }

  return (
    <>
      <iframe
        src={iframe}
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
        onLoad={onIframeLoadSuccess}
        className="google-drive-iframe"
      />

      <Button
        className={`absolute left-4 top-4 z-50 ${documentLoaded ? "" : "hidden"} bg-red-500`}
        onClick={() => {
          setIframe(null);
        }}
      >
        <XSquareIcon className="mr-2 h-4 w-4" />
        Close
      </Button>

      <div
        className={` ${documentLoaded ? "" : "hidden"} `}
        style={{
          width: 24,
          height: 24,
          position: "absolute",
          top: 18,
          right: 18,
          zIndex: 55,
          backgroundColor: "#000",
        }}
      />
    </>
  );
}

export default MegillahModal;
