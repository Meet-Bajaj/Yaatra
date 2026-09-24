"use client";

import { useRef, useState } from "react";
import { MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: { address: string; lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter address",
  className,
  icon,
}: AddressAutocompleteProps) {
  const [predictions, setPredictions] = useState<Array<{ description: string; place_id: string }>>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  const ensureServices = () => {
    if (!autocompleteService.current && typeof window !== "undefined" && window.google?.maps?.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(document.createElement("div"));
    }
  };

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    ensureServices();

    if (!autocompleteService.current || inputValue.length < 2) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      { input: inputValue, componentRestrictions: { country: "in" } },
      (preds) => {
        setPredictions(preds || []);
        setShowPredictions((preds?.length ?? 0) > 0);
      }
    );
  };

  const handleSelectPrediction = (prediction: { description: string; place_id: string }) => {
    onChange(prediction.description);
    setShowPredictions(false);
    ensureServices();

    if (placesService.current) {
      placesService.current.getDetails(
        { placeId: prediction.place_id, fields: ["formatted_address", "geometry.location"] },
        (result, status) => {
          if (status === "OK" && result?.geometry?.location) {
            onPlaceSelect({
              address: result.formatted_address || prediction.description,
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng(),
            });
          }
        }
      );
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20">
        {icon || <MapPin className="h-4 w-4 shrink-0 text-white/30" />}
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => predictions.length > 0 && setShowPredictions(true)}
          onBlur={() => setTimeout(() => setShowPredictions(false), 200)}
          placeholder={placeholder}
          className="h-11 flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setPredictions([]);
              setShowPredictions(false);
            }}
            className="text-white/30 hover:text-white/60"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showPredictions && predictions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-[#0a0a0a] shadow-xl">
          {predictions.map((pred) => (
            <button
              key={pred.place_id}
              type="button"
              onMouseDown={() => handleSelectPrediction(pred)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <MapPin className="h-4 w-4 shrink-0 text-white/30" />
              <span className="truncate">{pred.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
