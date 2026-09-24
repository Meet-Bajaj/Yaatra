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

function FallbackMap({ className, height }: { className?: string; height?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] ${className || ""}`}
      style={{ height }}
    >
      <p className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent py-2 text-[10px] text-white/40">
        Route preview
      </p>
    </div>
  );
}

export function RouteMap(props: RouteMapProps) {
  if (isLeaflet()) {
    return <LeafletRouteMap {...props} />;
  }
  return <GoogleRouteMap {...props} />;
}
