import { apiClient } from './apiClient';
import { ApiResponse, Vehicle } from './types';

export interface VehiclePayload {
  driverId?: string;
  type: 'CAR' | 'RICKSHAW';
  registrationNumber?: string;
  reg_number?: string;
  capacity?: number;
  capicity?: number;
  make?: string;
  model?: string;
  year?: number;
  rcDocUrl?: string;
  insuranceDocUrl?: string;
  photoUrl?: string;
}

export const vehicleService = {
  async registerVehicle(data: VehiclePayload) {
    const response = await apiClient.post<ApiResponse<Vehicle>>('/vehicle/register', data);
    return response.data.data;
  },

  async getVehicleById(id: string) {
    const response = await apiClient.get<ApiResponse<Vehicle>>(`/vehicle/${id}`);
    return response.data.data;
  },
};
