import { appConfig } from '../constants/config';

interface GoogleAutocompletePrediction {
  description: string;
  place_id: string;
}

interface GoogleAutocompleteResponse {
  status: string;
  predictions?: GoogleAutocompletePrediction[];
  error_message?: string;
}

interface GooglePlaceDetailsResponse {
  status: string;
  result?: {
    name?: string;
    formatted_address?: string;
    geometry?: {
      location?: {
        lat: number;
        lng: number;
      };
    };
  };
  error_message?: string;
}

export interface PlaceSuggestion {
  id: string;
  title: string;
}

export interface PlaceCoordinates {
  latitude: number;
  longitude: number;
  label: string;
}

const getApiKey = () => {
  if (!appConfig.googleMapsApiKey) {
    throw new Error('Google Maps API key is missing. Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY.');
  }

  return appConfig.googleMapsApiKey;
};

export const mapsService = {
  async searchPlaces(input: string) {
    const trimmed = input.trim();
    if (!trimmed) {
      return [] as PlaceSuggestion[];
    }

    const key = getApiKey();
    const url =
      'https://maps.googleapis.com/maps/api/place/autocomplete/json' +
      `?input=${encodeURIComponent(trimmed)}` +
      `&key=${encodeURIComponent(key)}` +
      '&types=geocode';

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Unable to fetch place suggestions.');
    }

    const payload = (await response.json()) as GoogleAutocompleteResponse;
    if (payload.status !== 'OK' && payload.status !== 'ZERO_RESULTS') {
      throw new Error(payload.error_message || `Google Places error: ${payload.status}`);
    }

    return (payload.predictions || []).slice(0, 6).map((item) => ({
      id: item.place_id,
      title: item.description,
    }));
  },

  async getPlaceCoordinates(placeId: string) {
    const key = getApiKey();
    const url =
      'https://maps.googleapis.com/maps/api/place/details/json' +
      `?place_id=${encodeURIComponent(placeId)}` +
      '&fields=name,formatted_address,geometry' +
      `&key=${encodeURIComponent(key)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Unable to fetch place details.');
    }

    const payload = (await response.json()) as GooglePlaceDetailsResponse;
    if (payload.status !== 'OK' || !payload.result?.geometry?.location) {
      throw new Error(payload.error_message || 'Selected location does not have coordinates.');
    }

    const location = payload.result.geometry.location;
    const label = payload.result.formatted_address || payload.result.name || 'Selected destination';

    return {
      latitude: location.lat,
      longitude: location.lng,
      label,
    } as PlaceCoordinates;
  },
};
