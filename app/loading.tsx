"use client";

import { Spinner } from "@heroui/react";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-grow px-3 py-3 overflow-y-auto">
        <div className="flex justify-center items-center h-full">
          <Spinner size="lg" />
        </div>
      </main>
    </div>
  );
}