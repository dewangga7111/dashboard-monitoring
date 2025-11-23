"use client";

import * as React from "react";
import Sidebar from "@/components/sidebar/sidebar";
import { Navbar } from "@/components/navbar";
import { Suspense, useEffect, useState } from "react";
import Loading from "../loading";
import Footer from "@/components/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loading />;
  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <div className="sticky top-0 z-50 mx-3">
          <Navbar />
        </div>
        <main className="flex-grow px-3 py-3 overflow-y-auto 3xl:flex 3xl:justify-center">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
