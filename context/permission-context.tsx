"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { permissionList, Permission } from "@/dummy/permission";
import constants from "@/utils/constants";

type PermissionContextType = {
  permissions: Permission[];
  isLoading: boolean;
  canRead: (pageId: string) => boolean;
  canCreate: (pageId: string) => boolean;
  canUpdate: (pageId: string) => boolean;
  canDelete: (pageId: string) => boolean;
  hasPermission: (pageId: string, action: string) => boolean;
  getFirstAccessibleRoute: () => string | null;
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

// context ini untuk menyediakan permission untuk kebutuhan penjagaan
export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load permissions once
  useEffect(() => {
    const stored = localStorage.getItem("permissions");
    if (stored) {
      setPermissions(JSON.parse(stored));
    } else {
      // default simulated permissions
      setPermissions(permissionList);
    }
    setIsLoading(false);
  }, []);

  const hasPermission = (functionId: string, action: string) => {
    const perm = permissions.find(p => p.function_id === functionId);
    if (!perm) return false;
    return (perm as any)[action] === 'Y';
  };

  const canRead = (pageId: string) => hasPermission(pageId, constants.permission.READ);
  const canCreate = (pageId: string) => hasPermission(pageId, constants.permission.CREATE);
  const canUpdate = (pageId: string) => hasPermission(pageId, constants.permission.UPDATE);
  const canDelete = (pageId: string) => hasPermission(pageId, constants.permission.DELETE);

  const getFirstAccessibleRoute = () => {
    for (const route of constants.menuRoutes) {
      if (hasPermission(route.functionId, constants.permission.READ)) {
        return route.path;
      }
    }
    return null;
  };

  return (
    <PermissionContext.Provider value={{
      permissions,
      isLoading,
      hasPermission,
      canRead,
      canCreate,
      canUpdate,
      canDelete,
      getFirstAccessibleRoute
    }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error("usePermission must be used within PermissionProvider");
  return ctx;
};
