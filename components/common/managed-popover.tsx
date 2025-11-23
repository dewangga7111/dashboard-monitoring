"use client";

import { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverProps,
} from "@heroui/react";

interface ManagedPopoverProps extends Omit<PopoverProps, 'isOpen' | 'onOpenChange' | 'children'> {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const ManagedPopover = ({ trigger, children, ...props }: ManagedPopoverProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const handleCloseAll = () => setIsPopoverOpen(false);
    window.addEventListener("close-all-popovers", handleCloseAll);
    return () => window.removeEventListener("close-all-popovers", handleCloseAll);
  }, []);

  return (
    <Popover
      placement="bottom"
      {...props}
      isOpen={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
    >
      <PopoverTrigger onPress={() => setIsPopoverOpen(v => !v)}>{trigger}</PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
};
