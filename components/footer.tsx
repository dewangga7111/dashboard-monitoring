import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  const appName = process.env.NEXT_PUBLIC_WEB_TITLE || "MyApp";

  return (
    <footer className="text-center py-3 border-t border-default-100 text-sm text-default-500 ">
      © {year} {appName}. All rights reserved.
    </footer>
  );
}
