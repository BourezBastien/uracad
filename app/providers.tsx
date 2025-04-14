"use client";

import { Toaster } from "@/components/ui/sonner";
import { DialogManagerRenderer } from "@/features/dialog-manager/dialog-manager-renderer";
import { GlobalDialogLazy } from "@/features/global-dialog/global-dialog-lazy";
import { SearchParamsMessageToastSuspended } from "@/features/searchparams-message/search-params-message-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

// Configurer le client avec des options qui limitent les requêtes en arrière-plan
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes avant qu'une requête ne soit considérée comme périmée
      refetchOnWindowFocus: false, // Ne pas refetch quand la fenêtre reprend le focus
      refetchOnReconnect: false, // Ne pas refetch quand la connexion est rétablie
      refetchOnMount: false, // Ne pas refetch quand le composant est monté
      refetchInterval: false, // Désactiver le polling automatique
    },
  },
});

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <DialogManagerRenderer />
        <GlobalDialogLazy />
        <SearchParamsMessageToastSuspended />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
};
