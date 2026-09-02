"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { ReactNode } from "react";

const MAPS_KEY = process.env.NEXT_PUBLIC_MAPS_KEY || "";

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  if (!MAPS_KEY) {
    return <>{children}</>;
  }

  return (
    <APIProvider apiKey={MAPS_KEY}>
      {children}
    </APIProvider>
  );
}
