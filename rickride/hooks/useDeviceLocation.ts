import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

export interface DeviceLocation {
  latitude: number;
  longitude: number;
}

interface UseDeviceLocationOptions {
  autoRequest?: boolean;
}

export function useDeviceLocation(options: UseDeviceLocationOptions = {}) {
  const { autoRequest = true } = options;
  const [loading, setLoading] = useState(autoRequest);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<DeviceLocation | null>(null);
  const [addressLabel, setAddressLabel] = useState<string | null>(null);

  const refreshLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        throw new Error('Location permission is required for nearby ride discovery.');
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const nextLocation = {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      };

      setLocation(nextLocation);

      try {
        const addresses = await Location.reverseGeocodeAsync(nextLocation);
        const firstAddress = addresses[0];

        if (firstAddress) {
          const parts = [firstAddress.city, firstAddress.subregion, firstAddress.region].filter(
            Boolean
          );
          setAddressLabel(parts.join(', ') || null);
        }
      } catch {
        setAddressLabel(null);
      }

      return nextLocation;
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to fetch location';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoRequest) {
      return;
    }

    refreshLocation().catch(() => undefined);
  }, [autoRequest, refreshLocation]);

  return {
    loading,
    error,
    location,
    addressLabel,
    refreshLocation,
  };
}
