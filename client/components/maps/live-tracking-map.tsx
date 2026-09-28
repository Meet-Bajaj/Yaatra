"use client";

import dynamic from "next/dynamic";
import { isLeaflet } from "@/lib/map-config";

const LeafletLiveTrackingMap = dynamic(
  () => import("./leaflet/live-tracking-map").then((m) => m.LiveTrackingMap),
  { ssr: false }
);

const GoogleLiveTrackingMap = dynamic(
  () => import("./google/live-tracking-map").then((m) => m.LiveTrackingMap),
  { ssr: false }
);

interface LiveTrackingMapProps {
  pickup?: { lat: number; lng: number };
  dropoff?: { lat: number; lng: number };
  driverPosition?: { lat: number; lng: number } | null;
  className?: string;
  height?: string;
}

export function LiveTrackingMap(props: LiveTrackingMapProps) {
  if (isLeaflet()) {
    return <LeafletLiveTrackingMap {...props} />;
  }
  return <GoogleLiveTrackingMap {...props} />;
}
