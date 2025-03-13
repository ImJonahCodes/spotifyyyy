"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased dark bg-[#121212]";
  }, []);

  return (
    <body className="antialiased dark bg-[#121212]" suppressHydrationWarning>
      {children}
    </body>
  );
}
