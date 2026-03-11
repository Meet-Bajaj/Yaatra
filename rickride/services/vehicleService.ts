import { mockVehicles } from './mockData';

export const vehicleService = {
    getVehicleById: async (id: string) => {
        return mockVehicles.find(vehicle => vehicle._id === id);
    },
    getVehiclesByDriverId: async (driverId: string) => {
        return mockVehicles.filter(vehicle => vehicle.driver === driverId);
    },
    getAllVehicles: async () => {
        return mockVehicles;
    },
};
