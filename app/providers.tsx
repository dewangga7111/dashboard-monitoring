"use client";

import { BreadcrumbProvider } from "@/context/breadcrumbs-context";
import { PermissionProvider } from "@/context/permission-context";
import { ConfirmationProvider } from "@/context/confirmation-context";

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { ReduxProvider } from "@/redux/providers";
import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <ReduxProvider>
      <HeroUIProvider navigate={router.push}>
        <ToastProvider placement="top-right" toastOffset={10} />
        <NextThemesProvider {...themeProps}>
          <ConfirmationProvider>
            <PermissionProvider>
              <BreadcrumbProvider>
                {children}
              </BreadcrumbProvider>
            </PermissionProvider>
          </ConfirmationProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </ReduxProvider>
  );
}
