import { Tooltip, addToast, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { useState } from "react";

export const formatEllipsis = (text: string, maxChars: number = 12): React.ReactNode => {
  if (!text) return "-";

  if (text.length <= maxChars) return text;

  const truncated = text.slice(0, maxChars) + "...";

  return (
    <Tooltip content={text} delay={500} showArrow color="foreground">
      <span className="cursor-help">{truncated}</span>
    </Tooltip>
  );
};

export const showSuccessToast = (msg: string) => {
  addToast({
    title: "Success",
    description: msg,
    color: 'success',
    timeout: 3000,
  })
}

export const showErrorToast = (msg: string) => {
  addToast({
    title: "Error",
    description: msg,
    color: 'danger',
    timeout: 3000,
  })
}

export const formatFromMB = (mb: number) => {
  const format = (num: number) => {
    const fixed = num.toFixed(2);
    return fixed.endsWith(".00") ? fixed.replace(".00", "") : fixed;
  };

  if (mb >= 1024 * 1024) return format(mb / (1024 * 1024)) + " TB";
  if (mb >= 1024) return format(mb / 1024) + " GB";
  if (mb >= 1) return format(mb) + " MB";

  // KB — no decimals
  return Math.round(mb * 1024) + " KB";
};

export const formatFromBytes = (bytes: number) => {
  if (bytes < 0) return "0 B";

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  const TB = GB * 1024;

  const format = (num: number) => {
    const fixed = num.toFixed(2);
    return fixed.endsWith(".00") ? fixed.replace(".00", "") : fixed;
  };

  if (bytes >= TB) return format(bytes / TB) + " TB";
  if (bytes >= GB) return format(bytes / GB) + " GB";
  if (bytes >= MB) return format(bytes / MB) + " MB";

  // KB — integer only
  if (bytes >= KB) return Math.floor(bytes / KB) + " KB";

  return bytes + " B"; // bytes as-is
};

export const formatK = (num: number): string => {
  if (num < 1000) return num.toString();

  const value = num / 1000;
  let formatted = value.toFixed(1); // one decimal max

  // remove trailing .0
  if (formatted.endsWith(".0")) {
    formatted = formatted.replace(".0", "");
  }

  // change "." → "," (Indonesian format)
  formatted = formatted.replace(".", ",");

  return formatted + "k";
};



