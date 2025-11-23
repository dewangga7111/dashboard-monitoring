"use client";

import { button, title } from "@/utils/primitives";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-grow px-3 py-3 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className={title({ color: "red" })}>404 Not Found</h1>
          <p className="text-gray-600 mt-2">The page you are looking for doesn’t exist or has been moved.</p>
          <Button
            color="primary"
            className={`${button()} mt-5`}
            onPress={() => router.push("/")}
          >
            Back Home
          </Button>
        </div>
      </main>
    </div>
  );
}
