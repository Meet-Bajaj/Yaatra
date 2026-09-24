"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

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
  const [predictions, setPredictions] = useState<NominatimResult[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const searchNominatim = useCallback(async (query: string) => {
    if (query.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&addressdetails=1`,
        { headers: { "User-Agent": "YaatraApp/1.0" } }
      );
      const data: NominatimResult[] = await res.json();
      setPredictions(data);
      setShowPredictions(data.length > 0);
    } catch {
      setPredictions([]);
      setShowPredictions(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchNominatim(inputValue), 400);
  };

  const handleSelect = (result: NominatimResult) => {
    onChange(result.display_name);
    setShowPredictions(false);
    onPlaceSelect({
      address: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    });
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20">
        {icon || <MapPin className="h-4 w-4 shrink-0 text-white/30" />}
        <input
          ref={inputRef}
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
          {predictions.map((result) => (
            <button
              key={result.place_id}
              type="button"
              onMouseDown={() => handleSelect(result)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <MapPin className="h-4 w-4 shrink-0 text-white/30" />
              <span className="truncate">{result.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {loading && showPredictions && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
        </div>
      )}
    </div>
  );
}
