"use client";

import { useEffect, useState } from "react";
import { Button, Tooltip, ScrollShadow, Image } from "@heroui/react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { isMobile } from "react-device-detect";
import logo from "@/assets/images/logo.png"

import SidebarMenuItem from "./sidebar-item";
import { menus } from "@/config/menu";
import { isMenuActive } from "./utils";
import { usePermission } from "@/context/permission-context";
import constants from "@/utils/constants";

interface SidebarContentProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  onClose?: () => void; // 👈 NEW
}

export default function SidebarContent({ open, setOpen, onClose }: SidebarContentProps) {
  const [mounted, setMounted] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const { theme } = useTheme();
  const { hasPermission } = usePermission();
  const appName = process.env.NEXT_PUBLIC_WEB_TITLE || "MyApp";

  useEffect(() => setMounted(true), []);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};
    menus.forEach((item) => {
      if (item.children && isMenuActive(item, pathname)) {
        newOpenMenus[item.key] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...newOpenMenus }));
  }, [pathname]);

  const shouldShowMenu = (item: any): boolean => {
    if (item.key && hasPermission(item.key, constants.permission.READ)) return true;
    if (item.children && item.children.some((child: any) => shouldShowMenu(child)))
      return true;
    return false;
  };

  if (!mounted) return null;

  return (
    <>
      {/* Header */}
      {isMobile ? (
        <div className="flex items-center justify-center p-3">
          {open && <span className="font-bold">{appName}</span>}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3">
          <Tooltip
            content={open ? "Close Sidebar" : "Open Sidebar"}
            showArrow
            placement="right"
            color="foreground"
            closeDelay={0}
            delay={500}
            size="sm"
          >
            <Button
              isIconOnly
              variant="light"
              onPress={() => setOpen(!open)}
              aria-label="Toggle Menu"
            >
              <Menu size={20} />
            </Button>
          </Tooltip>
          {open && <span className="font-bold"><Image src={logo.src} alt="Logo" height={50} /></span>}
        </div>
      )}

      {/* Menu */}
      <ScrollShadow aria-label="Sidebar menu" className="flex-grow">
        {menus
          .filter((item) => shouldShowMenu(item))
          .map((item) => (
            <SidebarMenuItem
              key={item.key || item.label}
              item={{
                ...item,
                children: item.children?.filter((child) => shouldShowMenu(child)),
              }}
              pathname={pathname}
              theme={theme}
              open={open}
              openMenus={openMenus}
              toggleMenu={toggleMenu}
              mounted={mounted}
              onClose={onClose}
            />
          ))}
      </ScrollShadow>
    </>
  );
}
