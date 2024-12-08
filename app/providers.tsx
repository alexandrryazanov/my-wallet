"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { initFirebase } from "@/services/firebase";
import useAuthListener from "@/hooks/useAuthListener";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationProvider from "@/contexts/ConfirmationContext/Provider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

initFirebase();

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  useAuthListener();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <ConfirmationProvider>{children}</ConfirmationProvider>
        <ToastContainer />
      </NextThemesProvider>
    </NextUIProvider>
  );
}
