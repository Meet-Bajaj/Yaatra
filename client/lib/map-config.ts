export type MapsProvider = "google" | "leaflet";

export function getMapsProvider(): MapsProvider {
  const provider = (process.env.NEXT_PUBLIC_MAPS_PROVIDER || "leaflet").toLowerCase();
  return provider === "google" ? "google" : "leaflet";
}

export function isGoogleMaps(): boolean {
  return getMapsProvider() === "google" && !!process.env.NEXT_PUBLIC_MAPS_KEY;
}

export function isLeaflet(): boolean {
  return getMapsProvider() === "leaflet";
}
