"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 🔑 breadcrumb type
export type Breadcrumb = {
  label: string;
  path?: string;
};

type BreadcrumbContextType = {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (crumbs: Breadcrumb[]) => void;
  pushBreadcrumb: (crumb: Breadcrumb) => void;
  popBreadcrumb: () => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  // helpers if you want push/remove
  const pushBreadcrumb = (crumb: Breadcrumb) =>
    setBreadcrumbs((prev) => [...prev, crumb]);

  const popBreadcrumb = () =>
    setBreadcrumbs((prev) => prev.slice(0, prev.length - 1));

  return (
    <BreadcrumbContext.Provider
      value={{ breadcrumbs, setBreadcrumbs, pushBreadcrumb, popBreadcrumb }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx)
    throw new Error("useBreadcrumbs must be used within BreadcrumbProvider");
  return ctx;
};
