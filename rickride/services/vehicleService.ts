import { apiClient } from './apiClient';

export interface VehiclePayload {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  type: 'auto' | 'car';
  color?: string;
}

export const vehicleService = {
  /**
   * Add a new vehicle to the authenticated driver.
   * Path: POST /vehicles
   */
  addVehicle: async (data: VehiclePayload) => {
    const response = await apiClient.post('/vehicles', data);
    return response.data;
  },

  /**
   * Get all vehicles belonging to the authenticated driver.
   * Path: GET /vehicles/me
   */
  getMyVehicle: async () => {
    const response = await apiClient.get('/vehicles/me');
    return response.data;
  },

  /**
   * Update details of a specific vehicle.
   * Path: PATCH /vehicles/:id
   */
  updateVehicle: async (id: string, data: Partial<VehiclePayload>) => {
    const response = await apiClient.patch(`/vehicles/${id}`, data);
    return response.data;
  },

  /**
   * Delete a vehicle from the driver's profile.
   * Path: DELETE /vehicles/:id
   */
  deleteVehicle: async (id: string) => {
    const response = await apiClient.delete(`/vehicles/${id}`);
    return response.data;
  },
};
