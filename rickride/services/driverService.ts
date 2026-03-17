import { apiClient } from './apiClient';

export interface CreateDriverPayload {
  licenseNumber: string;
  aadharNumber: string;
  // ...other onboarding details
}

export interface UpdateDriverStatusPayload {
  isOnline: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export const driverService = {
  /**
   * Create a driver profile attached to the user.
   * Path: POST /drivers
   */
  createDriverProfile: async (data: CreateDriverPayload) => {
    const response = await apiClient.post('/drivers', data);
    return response.data;
  },

  /**
   * Retrieve the authenticated driver's profile.
   * Path: GET /drivers/me
   */
  getMyDriverProfile: async () => {
    const response = await apiClient.get('/drivers/me');
    return response.data;
  },

  /**
   * Toggle online/offline tracking status.
   * Path: PATCH /drivers/me/status
   */
  updateDriverStatus: async (data: UpdateDriverStatusPayload) => {
    const response = await apiClient.patch('/drivers/me/status', data);
    return response.data;
  },

  /**
   * Fetch active drivers near a specific location.
   * Path: GET /drivers/nearby
   */
  getNearbyDrivers: async (lat: number, lng: number, radiusInKm: number = 5) => {
    const response = await apiClient.get('/drivers/nearby', {
      params: { lat, lng, radius: radiusInKm },
    });
    return response.data;
  },

  /**
   * Get public details of a specific driver.
   * Path: GET /drivers/:id
   */
  getDriverById: async (id: string) => {
    const response = await apiClient.get(`/drivers/${id}`);
    return response.data;
  },
};
