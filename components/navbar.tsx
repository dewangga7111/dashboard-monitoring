"use client";

import { useEffect, useState } from "react";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Breadcrumbs,
  BreadcrumbItem,
  Drawer,
  useDisclosure,
  Button,
  DrawerContent,
  DrawerBody,
  Listbox,
  ListboxItem
} from "@heroui/react";
import { ThemeSwitch } from "@/components/theme-switch";
import { usePathname, useRouter } from "next/navigation";
import { EllipsisVertical, LogOut, Menu, User } from "lucide-react";
import { MobileView, isMobile } from "react-device-detect";

import { breadcrumbsItems } from "../config/breadcrumbs";
import { useBreadcrumbs, Breadcrumb } from "@/context/breadcrumbs-context";
import SidebarContent from "./sidebar/sidebar-content";
import { useConfirmation } from "@/context/confirmation-context";
import { showSuccessToast } from "@/utils/common";
import { ManagedPopover } from "./common/managed-popover";
import constants from "@/utils/constants"

const getBasePath = (path: string) => {
  if (!path) return "/";

  // remove query/hash
  let clean = path.split(/[?#]/)[0];

  // remove trailing slash (except root)
  if (clean !== "/" && clean.endsWith("/")) {
    clean = clean.slice(0, -1);
  }

  // convert dynamic segments (numbers or uuid-like) → :id
  const segments = clean.split("/").map((seg) => {
    if (/^\d+$/.test(seg)) return ":id";                 // numeric id
    if (/^[a-f0-9-]{8,}$/i.test(seg)) return ":id";      // uuid-like
    return seg;
  });

  return segments.join("/").toLowerCase();
};



// 🔑 Recursive function to find the breadcrumb trail
const findBreadcrumbTrail = (
  items: any[],
  pathname: string,
  trail: Breadcrumb[] = []
): Breadcrumb[] | null => {
  const base = getBasePath(pathname).toLowerCase();

  for (const item of items) {
    const itemPath = (item.path || "").toLowerCase();
    const newTrail = [...trail, { label: item.label, path: item.path }];

    if (itemPath === base) {
      return newTrail;
    }

    if (item.children) {
      const found = findBreadcrumbTrail(item.children, pathname, newTrail);
      if (found) return found;
    }
  }

  return null;
};


export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumbs();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { confirm } = useConfirmation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const trail = findBreadcrumbTrail(breadcrumbsItems, pathname) || [];
    setBreadcrumbs(trail);
  }, [pathname, setBreadcrumbs]);

  if (!mounted) return null;

  return (
    <>
      <HeroNavbar
        maxWidth="full"
        height="50px"
        className="backdrop-blur-md rounded-bl-lg rounded-br-lg shadow-sm"
        position="sticky"
      >
        {isMobile ? (
          <NavbarBrand>
            <Button
              isIconOnly
              variant="light"
              onPress={onOpen}
              aria-label="Toggle Menu"
            >
              <Menu size={20} />
            </Button>
          </NavbarBrand>
        ) : (
          <NavbarBrand>
            {breadcrumbs.length > 0 && (
              <Breadcrumbs size="md">
                {breadcrumbs.map((crumb, idx) => (
                  <BreadcrumbItem key={idx} onPress={() => router.push(crumb.path as string)} isDisabled={!crumb.path} className="font-semibold">
                    {crumb.label}
                  </BreadcrumbItem>
                ))}
              </Breadcrumbs>
            )}
          </NavbarBrand>
        )}

        {/* Right Section - Actions */}
        <NavbarContent justify="end">
          <NavbarItem className="flex items-center">
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="flex items-center">
            <Avatar
              isBordered
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              className="w-7 h-7 text-tiny"
            />
            <div className="mx-2 min-w-[120px]">
              <p className="text-sm font-medium ml-2">John Doe</p>
              <p className="text-xs text-default-500 ml-2">Admin</p>
            </div>
            <ManagedPopover
              trigger={
                <Button
                  variant="light"
                  size="sm"
                  isIconOnly
                >
                  <EllipsisVertical size={20} />
                </Button>
              }
            >
              <Listbox aria-label="User actions" variant="flat">
                <ListboxItem
                  key="profile"
                  startContent={<User size={13} />}
                  onPress={() => {
                  }}
                >
                  Profile
                </ListboxItem>
                <ListboxItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  startContent={<LogOut size={13} />}
                  onPress={() => {
                    confirm({
                      message: constants.confirmation.LOGOUT,
                      onConfirm: () => {
                        showSuccessToast(constants.toast.SUCCESS_LOGOUT);
                        router.push(constants.path.LOGIN)
                      },
                    });
                  }}
                >
                  Logout
                </ListboxItem>
              </Listbox>
            </ManagedPopover>
          </NavbarItem>
        </NavbarContent>
      </HeroNavbar>
      <MobileView>
        <Drawer
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="full"
          placement="left"
          motionProps={{
            variants: {
              enter: {
                opacity: 1,
                x: 0,
              },
              exit: {
                x: -100,
                opacity: 0,
              },
            },
          }}
        >
          <DrawerContent>
            {(onClose) => (
              <DrawerBody>
                <SidebarContent open={true} setOpen={() => { }} onClose={onClose} />
              </DrawerBody>
            )}
          </DrawerContent>
        </Drawer>
      </MobileView>
    </>
  );
};
