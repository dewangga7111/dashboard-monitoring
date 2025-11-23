"use client";

import { useEffect } from "react";
import { title } from "@/utils/primitives";
import { Button } from "@heroui/react";
import { RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <span className={title({ size: 'sm' })} >Something went wrong!!!</span>
      <Button
        className="mt-4"
        color="primary"
        startContent={<RefreshCcw size={15} />}
        onPress={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Refresh
      </Button>
    </div>
  );
}
