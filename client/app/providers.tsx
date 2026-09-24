"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useSocket } from "@/hooks/use-socket";
import { GoogleMapsProvider } from "@/components/maps/google-maps-provider";
import { isGoogleMaps } from "@/lib/map-config";

function SocketProvider({ children }: { children: React.ReactNode }) {
  useSocket();
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const content = (
    <SocketProvider>{children}</SocketProvider>
  );

  if (isGoogleMaps()) {
    return (
      <QueryClientProvider client={queryClient}>
        <GoogleMapsProvider>{content}</GoogleMapsProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {content}
    </QueryClientProvider>
  );
}
