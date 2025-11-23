"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Loading from "../loading";

export default function MainLayout({ children }: { children: React.ReactNode }) {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-grow px-3 py-3 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
