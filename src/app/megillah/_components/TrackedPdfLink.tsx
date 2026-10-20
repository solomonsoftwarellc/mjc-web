"use client";

import type { ReactNode } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type TrackedPdfLinkProps = {
  href: string;
  issue: number;
  className?: string;
  children: ReactNode;
};

/**
 * Opens an issue's PDF in a new tab and logs a `pdf_click` event to Google
 * Analytics with the issue number, so the most-read issues can be ranked.
 */
export default function TrackedPdfLink({
  href,
  issue,
  className,
  children,
}: TrackedPdfLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        window.gtag?.("event", "pdf_click", {
          issue_number: String(issue),
          transport_type: "beacon",
        });
      }}
    >
      {children}
    </a>
  );
}
