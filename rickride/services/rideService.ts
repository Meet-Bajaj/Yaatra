import { mockTrips, mockBookings } from './mockData';

export const rideService = {
    // Trips
    getTripById: async (id: string) => {
        return mockTrips.find(trip => trip._id === id);
    },
    getTripsByDriverId: async (driverId: string) => {
        return mockTrips.filter(trip => trip.driver === driverId);
    },
    getAllTrips: async () => {
        return mockTrips;
    },

    // Bookings
    getBookingById: async (id: string) => {
        return mockBookings.find(booking => booking._id === id);
    },
    getBookingsByRiderId: async (riderId: string) => {
        return mockBookings.filter(booking => booking.rider === riderId);
    },
    getAllBookings: async () => {
        return mockBookings;
    },
};
