"use client";

import constants from "@/utils/constants"
import { usePermission } from "@/context/permission-context";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// This context is just a placeholder (no values exposed)
const RouteGuardContext = createContext<boolean | undefined>(undefined);

export const RouteGuardProvider = ({
  children,
  functionId,
  access,
}: {
  children: React.ReactNode;
  functionId: string;
  access: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission, isLoading } = usePermission();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Wait for permissions to load before checking
    if (isLoading) {
      return;
    }

    // Middleware already handles authentication, we only check permissions here

    // Handle forbidden page - allow access without permission check
    if (pathname === constants.path.UNAUTHORIZED) {
      setIsAuthorized(true);
      return;
    }

    // Check permissions if functionId is provided
    if (functionId) {
      const hasAccess = hasPermission(functionId, access);

      if (!hasAccess) {
        console.warn(`🚫 No ${access} permission for function: ${functionId}`);
        router.push(constants.path.UNAUTHORIZED);
        return;
      }
    }

    // Allow navigation
    setIsAuthorized(true);
  }, [functionId, access, hasPermission, isLoading, router, pathname]);

  // Don't render until authorization check is complete
  if (!isAuthorized) {
    return null;
  }

  return (
    <RouteGuardContext.Provider value={true}>
      {children}
    </RouteGuardContext.Provider>
  );
};
