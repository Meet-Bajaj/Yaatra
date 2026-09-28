"use client";

import dynamic from "next/dynamic";
import { isLeaflet } from "@/lib/map-config";

const LeafletRouteMap = dynamic(
  () => import("./leaflet/route-map").then((m) => m.RouteMap),
  { ssr: false }
);

const GoogleRouteMap = dynamic(
  () => import("./google/route-map").then((m) => m.RouteMap),
  { ssr: false }
);

interface RouteMapProps {
  pickup: { lat: number; lng: number; address?: string };
  dropoff: { lat: number; lng: number; address?: string };
  driverPosition?: { lat: number; lng: number } | null;
  className?: string;
  height?: string;
}

export function RouteMap(props: RouteMapProps) {
  if (isLeaflet()) {
    return <LeafletRouteMap {...props} />;
  }
  return <GoogleRouteMap {...props} />;
}
