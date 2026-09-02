"use client";

import { useEffect, useMemo } from "react";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

interface LiveTrackingMapProps {
  pickup?: { lat: number; lng: number };
  dropoff?: { lat: number; lng: number };
  driverPosition?: { lat: number; lng: number } | null;
  className?: string;
  height?: string;
}

function RoutePolyline({ pickup, dropoff }: { pickup?: { lat: number; lng: number }; dropoff?: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !pickup || !dropoff) return;

    const polyline = new google.maps.Polyline({
      path: [pickup, dropoff],
      strokeColor: "#ffffff",
      strokeOpacity: 0.5,
      strokeWeight: 2,
      geodesic: true,
    });

    polyline.setMap(map);

    return () => {
      polyline.setMap(null);
    };
  }, [map, pickup, dropoff]);

  return null;
}

export function LiveTrackingMap({
  pickup,
  dropoff,
  driverPosition,
  className,
  height = "300px",
}: LiveTrackingMapProps) {
  const center = useMemo(
    () =>
      driverPosition || (pickup && dropoff ? {
        lat: (pickup.lat + dropoff.lat) / 2,
        lng: (pickup.lng + dropoff.lng) / 2,
      } : pickup || dropoff || { lat: 12.9716, lng: 77.5946 }),
    [driverPosition, pickup, dropoff]
  );

  const MAPS_KEY = process.env.NEXT_PUBLIC_MAPS_KEY || "";

  if (!MAPS_KEY || (!pickup && !dropoff && !driverPosition)) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] ${className}`}
        style={{ height }}
      >
        {pickup && dropoff && (
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="20" y1="25" x2="80" y2="75" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" strokeOpacity="0.2" />
          </svg>
        )}
        {pickup && <div className="absolute left-[18%] top-[22%] flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[10px] text-white shadow-lg">📍</div>}
        {dropoff && <div className="absolute right-[18%] bottom-[22%] flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow-lg">🏁</div>}
        {driverPosition && <div className="absolute left-[45%] top-[45%] flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-sm shadow-lg">🚗</div>}
        <p className="relative z-10 text-xs text-white/30">{!MAPS_KEY ? "Map requires Google Maps API key" : "No location data"}</p>
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
        defaultZoom={15}
        gestureHandling="greedy"
        disableDefaultUI
        mapId="yaatra-tracking"
        style={{ width: "100%", height: "100%" }}
      >
        <RoutePolyline pickup={pickup} dropoff={dropoff} />
        {pickup && (
          <AdvancedMarker position={pickup} title="Pickup">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm text-white shadow-lg">
              📍
            </div>
          </AdvancedMarker>
        )}
        {dropoff && (
          <AdvancedMarker position={dropoff} title="Dropoff">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm text-white shadow-lg">
              🏁
            </div>
          </AdvancedMarker>
        )}
        {driverPosition && (
          <AdvancedMarker position={driverPosition} title="Driver">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg shadow-lg">
              🚗
            </div>
          </AdvancedMarker>
        )}
      </Map>
    </div>
  );
}
