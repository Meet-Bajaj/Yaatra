"use client";

import { useEffect, useMemo } from "react";
import { Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";

interface RouteMapProps {
  pickup: { lat: number; lng: number; address?: string };
  dropoff: { lat: number; lng: number; address?: string };
  driverPosition?: { lat: number; lng: number } | null;
  className?: string;
  height?: string;
}

function RoutePolyline({ pickup, dropoff }: { pickup: { lat: number; lng: number }; dropoff: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const polyline = new google.maps.Polyline({
      path: [pickup, dropoff],
      strokeColor: "#ffffff",
      strokeOpacity: 0.6,
      strokeWeight: 3,
      geodesic: true,
      icons: [
        {
          icon: { path: google.maps.SymbolPath.FORWARD_OPEN_ARROW, scale: 0 },
          offset: "0%",
          repeat: "40px",
        },
      ],
    });

    polyline.setMap(map);

    return () => {
      polyline.setMap(null);
    };
  }, [map, pickup, dropoff]);

  return null;
}

export function RouteMap({
  pickup,
  dropoff,
  driverPosition,
  className,
  height = "300px",
}: RouteMapProps) {
  const center = useMemo(
    () => ({
      lat: (pickup.lat + dropoff.lat) / 2,
      lng: (pickup.lng + dropoff.lng) / 2,
    }),
    [pickup.lat, pickup.lng, dropoff.lat, dropoff.lng]
  );

  const bounds = useMemo(() => {
    const latMin = Math.min(pickup.lat, dropoff.lat);
    const latMax = Math.max(pickup.lat, dropoff.lat);
    const lngMin = Math.min(pickup.lng, dropoff.lng);
    const lngMax = Math.max(pickup.lng, dropoff.lng);
    const latPad = (latMax - latMin) * 0.2 || 0.01;
    const lngPad = (lngMax - lngMin) * 0.2 || 0.01;
    return {
      north: latMax + latPad,
      south: latMin - latPad,
      east: lngMax + lngPad,
      west: lngMin - lngPad,
    };
  }, [pickup, dropoff]);

  const MAPS_KEY = process.env.NEXT_PUBLIC_MAPS_KEY || "";

  if (!MAPS_KEY) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] ${className}`}
        style={{ height }}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="20" y1="25" x2="80" y2="75" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" strokeOpacity="0.3" />
        </svg>
        <div className="absolute left-[18%] top-[22%] flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[10px] text-white shadow-lg">📍</div>
        <div className="absolute right-[18%] bottom-[22%] flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow-lg">🏁</div>
        {driverPosition && (
          <div className="absolute left-[45%] top-[45%] flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-sm shadow-lg">🚗</div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent py-2">
          <p className="text-[10px] text-white/40">Route preview</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 ${className}`}
      style={{ height }}
    >
      <Map
        defaultCenter={center}
        defaultBounds={bounds}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI
        mapId="yaatra-route"
        style={{ width: "100%", height: "100%" }}
      >
        <RoutePolyline pickup={pickup} dropoff={dropoff} />
        <AdvancedMarker position={pickup} title="Pickup">
          <Pin background="#22c55e" borderColor="#16a34a" scale={1.2} />
        </AdvancedMarker>
        <AdvancedMarker position={dropoff} title="Dropoff">
          <Pin background="#ef4444" borderColor="#dc2626" scale={1.2} />
        </AdvancedMarker>
        {driverPosition && (
          <AdvancedMarker position={driverPosition} title="Driver">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white shadow-lg">
              🚗
            </div>
          </AdvancedMarker>
        )}
      </Map>
    </div>
  );
}
