import React from "react";
import AuthProvider from "./_components/AuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dense data reads better in the sans; headings opt back into the serif.
  return (
    <div className="min-h-screen font-sans">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
