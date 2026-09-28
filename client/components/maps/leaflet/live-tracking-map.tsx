"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pickupIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50%;background:#22c55e;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.4);color:white;font-size:12px;">📍</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const dropoffIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50%;background:#ef4444;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.4);color:white;font-size:12px;">🏁</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const driverIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:36px;height:36px;border-radius:50%;background:#3b82f6;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(59,130,246,0.6);color:white;font-size:16px;">🚗</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

interface LiveTrackingMapProps {
  pickup?: { lat: number; lng: number };
  dropoff?: { lat: number; lng: number };
  driverPosition?: { lat: number; lng: number } | null;
  className?: string;
  height?: string;
}

function FitBounds({
  pickup,
  dropoff,
  driverPosition,
}: {
  pickup?: { lat: number; lng: number };
  dropoff?: { lat: number; lng: number };
  driverPosition?: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    const points: L.LatLngExpression[] = [];
    if (pickup) points.push([pickup.lat, pickup.lng]);
    if (dropoff) points.push([dropoff.lat, dropoff.lng]);
    if (driverPosition) points.push([driverPosition.lat, driverPosition.lng]);

    if (points.length >= 2) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    } else if (points.length === 1) {
      map.setView(points[0], 15);
    }
  }, [map, pickup, dropoff, driverPosition]);

  return null;
}

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
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
      driverPosition ||
      (pickup && dropoff
        ? { lat: (pickup.lat + dropoff.lat) / 2, lng: (pickup.lng + dropoff.lng) / 2 }
        : pickup || dropoff || { lat: 12.9716, lng: 77.5946 }),
    [driverPosition, pickup, dropoff]
  );

  const polyline = useMemo(() => {
    if (!pickup || !dropoff) return [];
    return [
      [pickup.lat, pickup.lng] as [number, number],
      [dropoff.lat, dropoff.lng] as [number, number],
    ];
  }, [pickup, dropoff]);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 ${className || ""}`}
      style={{ height }}
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={15}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%", background: "#0a0a0a" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <FitBounds pickup={pickup} dropoff={dropoff} driverPosition={driverPosition} />
        <InvalidateSize />
        {polyline.length > 0 && (
          <Polyline
            positions={polyline}
            pathOptions={{ color: "#ffffff", weight: 2, opacity: 0.5, dashArray: "6 8" }}
          />
        )}
        {pickup && <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />}
        {dropoff && <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon} />}
        {driverPosition && (
          <Marker position={[driverPosition.lat, driverPosition.lng]} icon={driverIcon} />
        )}
      </MapContainer>
    </div>
  );
}
