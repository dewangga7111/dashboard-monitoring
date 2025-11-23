"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { permissionList, Permission } from "@/dummy/permission";
import constants from "@/utils/constants";

type PermissionContextType = {
  permissions: Permission[];
  canRead: (pageId: string) => boolean;
  canCreate: (pageId: string) => boolean;
  canUpdate: (pageId: string) => boolean;
  canDelete: (pageId: string) => boolean;
  hasPermission: (pageId: string, action: string) => boolean;
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

// context ini untuk menyediakan permission untuk kebutuhan penjagaan
export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Load permissions once
  useEffect(() => {
    const stored = localStorage.getItem("permissions");
    if (stored) {
      setPermissions(JSON.parse(stored));
    } else {
      // default simulated permissions
      setPermissions(permissionList);
    }
  }, []);

  const hasPermission = (pageId: string, action: string) => {
    const perm = permissions.find(p => p.function_id === pageId);
    if (!perm) return false;
    return (perm as any)[action] === 'Y';
  };

  const canRead = (pageId: string) => hasPermission(pageId, constants.permission.READ);
  const canCreate = (pageId: string) => hasPermission(pageId, constants.permission.CREATE);
  const canUpdate = (pageId: string) => hasPermission(pageId, constants.permission.UPDATE);
  const canDelete = (pageId: string) => hasPermission(pageId, constants.permission.DELETE);

  return (
    <PermissionContext.Provider value={{ 
      permissions, 
      hasPermission,
      canRead,
      canCreate, 
      canUpdate,
      canDelete
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
