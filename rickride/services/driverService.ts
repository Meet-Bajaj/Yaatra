import { mockDrivers } from './mockData';

export const driverService = {
    getDriverById: async (id: string) => {
        return mockDrivers.find(driver => driver._id === id);
    },
    getDriverByUserId: async (userId: string) => {
        return mockDrivers.find(driver => driver.user === userId);
    },
    getAllDrivers: async () => {
        return mockDrivers;
    },
};
