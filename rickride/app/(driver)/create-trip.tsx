import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { useDeviceLocation } from '../../hooks/useDeviceLocation';
import { mapsService, PlaceSuggestion } from '../../services/mapsService';
import { tripService } from '../../services/tripService';

const createDefaultDeparture = () => {
  const date = new Date(Date.now() + 30 * 60 * 1000);
  return date.toISOString().slice(0, 16);
};

export default function CreateTripScreen() {
  const router = useRouter();
  const locationState = useDeviceLocation({ autoRequest: true });

  const [distance, setDistance] = useState('5');
  const [totalSeats, setTotalSeats] = useState('3');
  const [pricePerSeat, setPricePerSeat] = useState('80');
  const [departureTime, setDepartureTime] = useState(createDefaultDeparture());
  const [notes, setNotes] = useState('');

  const [originLongitude, setOriginLongitude] = useState('');
  const [originLatitude, setOriginLatitude] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [destinationLabel, setDestinationLabel] = useState('');
  const [destinationLongitude, setDestinationLongitude] = useState<number | null>(null);
  const [destinationLatitude, setDestinationLatitude] = useState<number | null>(null);
  const [destinationSuggestions, setDestinationSuggestions] = useState<PlaceSuggestion[]>([]);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const [selectingDestination, setSelectingDestination] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!locationState.location) {
      return;
    }

    if (!originLongitude && !originLatitude) {
      setOriginLongitude(String(Number(locationState.location.longitude.toFixed(6))));
      setOriginLatitude(String(Number(locationState.location.latitude.toFixed(6))));
    }
  }, [locationState.location, originLatitude, originLongitude]);

  useEffect(() => {
    const trimmed = destinationQuery.trim();

    if (!trimmed) {
      setDestinationSuggestions([]);
      return;
    }

    let cancelled = false;
    setFetchingSuggestions(true);

    const timer = setTimeout(() => {
      mapsService
        .searchPlaces(trimmed)
        .then((items) => {
          if (!cancelled) {
            setDestinationSuggestions(items);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setDestinationSuggestions([]);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setFetchingSuggestions(false);
          }
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [destinationQuery]);

  const selectedDestinationText = useMemo(() => {
    if (!destinationLatitude || !destinationLongitude) {
      return 'No destination selected';
    }

    return `${destinationLatitude.toFixed(6)}, ${destinationLongitude.toFixed(6)}`;
  }, [destinationLatitude, destinationLongitude]);

  const handlePickDestination = async (suggestion: PlaceSuggestion) => {
    setSelectingDestination(true);

    try {
      const details = await mapsService.getPlaceCoordinates(suggestion.id);
      setDestinationLatitude(details.latitude);
      setDestinationLongitude(details.longitude);
      setDestinationLabel(details.label);
      setDestinationQuery(details.label);
      setDestinationSuggestions([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to select destination.';
      Toast.show({
        type: 'error',
        text1: 'Destination error',
        text2: message,
      });
    } finally {
      setSelectingDestination(false);
    }
  };

  const handleCreateTrip = async () => {
    const parsedOriginLng = Number(originLongitude);
    const parsedOriginLat = Number(originLatitude);
    const parsedDestinationLng = Number(destinationLongitude);
    const parsedDestinationLat = Number(destinationLatitude);
    const parsedDistance = Number(distance);
    const parsedSeats = Number(totalSeats);
    const parsedPrice = Number(pricePerSeat);
    const parsedDepartureDate = new Date(departureTime);

    if (!destinationLatitude || !destinationLongitude) {
      Toast.show({
        type: 'error',
        text1: 'Select destination',
        text2: 'Use Google Maps suggestions to choose destination.',
      });
      return;
    }

    if (
      !Number.isFinite(parsedOriginLng) ||
      !Number.isFinite(parsedOriginLat) ||
      !Number.isFinite(parsedDestinationLng) ||
      !Number.isFinite(parsedDestinationLat)
    ) {
      Toast.show({
        type: 'error',
        text1: 'Invalid coordinates',
        text2: 'Please provide valid origin and destination coordinates.',
      });
      return;
    }

    if (!Number.isFinite(parsedDistance) || parsedDistance <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid distance',
        text2: 'Distance must be greater than 0.',
      });
      return;
    }

    if (!Number.isFinite(parsedSeats) || parsedSeats < 1 || parsedSeats > 8) {
      Toast.show({
        type: 'error',
        text1: 'Invalid seats',
        text2: 'Seats should be between 1 and 8.',
      });
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid fare',
        text2: 'Price per seat cannot be negative.',
      });
      return;
    }

    if (Number.isNaN(parsedDepartureDate.getTime())) {
      Toast.show({
        type: 'error',
        text1: 'Invalid departure time',
        text2: 'Use a valid date-time value.',
      });
      return;
    }

    setSubmitting(true);

    try {
      const trip = await tripService.createTrip({
        origin: [parsedOriginLng, parsedOriginLat],
        destination: [parsedDestinationLng, parsedDestinationLat],
        distance: parsedDistance,
        departureTime: parsedDepartureDate.toISOString(),
        totalSeats: parsedSeats,
        pricePerSeat: parsedPrice,
        notes: notes.trim() || undefined,
      });

      Toast.show({
        type: 'success',
        text1: 'Trip created',
        text2: `Trip ${trip._id.slice(-6)} is now available for riders.`,
      });

      router.replace('/(driver)/requests');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-backgroundLight flex-1">
      <ScrollView className="px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-sm uppercase tracking-[2px] text-primary">Driver</Text>
        <Text className="mt-2 text-3xl font-bold text-surfaceDark">Create trip</Text>
        <Text className="mt-2 text-sm text-gray-500">
          Publish a route to let passengers discover and book seats.
        </Text>

        <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <Text className="mb-4 text-lg font-bold text-surfaceDark">Origin</Text>
          <FormInput
            label="Origin longitude"
            keyboardType="numeric"
            value={originLongitude}
            onChangeText={setOriginLongitude}
            placeholder="72.5714"
          />
          <FormInput
            label="Origin latitude"
            keyboardType="numeric"
            value={originLatitude}
            onChangeText={setOriginLatitude}
            placeholder="23.0225"
          />
          {locationState.addressLabel ? (
            <Text className="text-xs text-gray-500">Detected area: {locationState.addressLabel}</Text>
          ) : null}

          <Text className="mb-4 mt-4 text-lg font-bold text-surfaceDark">Destination</Text>
          <FormInput
            label="Search destination"
            value={destinationQuery}
            onChangeText={setDestinationQuery}
            placeholder="Type area, landmark, or address"
          />
          <Text className="mt-2 text-xs text-gray-500">
            Selected coordinates: {selectedDestinationText}
          </Text>
          {destinationLabel ? (
            <Text className="mt-1 text-xs text-gray-500">Destination: {destinationLabel}</Text>
          ) : null}

          {fetchingSuggestions ? (
            <Text className="mt-3 text-xs text-gray-500">Searching Google Maps...</Text>
          ) : null}

          {!!destinationSuggestions.length ? (
            <View className="mt-3 gap-2">
              {destinationSuggestions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handlePickDestination(item)}
                  disabled={selectingDestination}
                  className="rounded-2xl bg-backgroundLight px-3 py-3">
                  <Text className="text-sm text-surfaceDark">{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>

        <View className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <Text className="mb-4 text-lg font-bold text-surfaceDark">Trip details</Text>
          <FormInput
            label="Distance (km)"
            keyboardType="numeric"
            value={distance}
            onChangeText={setDistance}
            placeholder="12.5"
          />
          <FormInput
            label="Departure (YYYY-MM-DDTHH:mm)"
            value={departureTime}
            onChangeText={setDepartureTime}
            placeholder="2026-04-16T18:30"
          />
          <FormInput
            label="Total seats"
            keyboardType="number-pad"
            value={totalSeats}
            onChangeText={setTotalSeats}
            placeholder="3"
          />
          <FormInput
            label="Price per seat (INR)"
            keyboardType="numeric"
            value={pricePerSeat}
            onChangeText={setPricePerSeat}
            placeholder="80"
          />
          <FormInput
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Pickup near metro gate"
          />
        </View>

        <View className="mb-10 mt-6">
          <Button
            title={submitting ? 'Publishing trip...' : 'Publish trip'}
            onPress={handleCreateTrip}
            disabled={submitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
