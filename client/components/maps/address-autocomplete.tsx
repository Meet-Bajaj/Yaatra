"use client";

import dynamic from "next/dynamic";
import { isLeaflet } from "@/lib/map-config";

const LeafletAddressAutocomplete = dynamic(
  () => import("./leaflet/address-autocomplete").then((m) => m.AddressAutocomplete),
  { ssr: false }
);

const GoogleAddressAutocomplete = dynamic(
  () => import("./google/address-autocomplete").then((m) => m.AddressAutocomplete),
  { ssr: false }
);

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: { address: string; lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function AddressAutocomplete(props: AddressAutocompleteProps) {
  if (isLeaflet()) {
    return <LeafletAddressAutocomplete {...props} />;
  }
  return <GoogleAddressAutocomplete {...props} />;
}
