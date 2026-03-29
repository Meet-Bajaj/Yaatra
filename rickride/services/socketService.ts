import { io, Socket } from 'socket.io-client';

import { appConfig } from '../constants/config';
import { getAuthToken } from '../store/useAuthStore';

class SocketService {
  private socket: Socket | null = null;
  private isConnecting = false;

  async connect() {
    if (this.socket?.connected || this.isConnecting) {
      return this.socket;
    }

    this.isConnecting = true;

    const token = await getAuthToken();
    this.socket = io(`${appConfig.socketUrl}/driver-location`, {
      auth: token ? { token } : undefined,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
    });

    this.socket.on('connect', () => {
      this.isConnecting = false;
    });

    this.socket.on('disconnect', () => {
      this.isConnecting = false;
    });

    this.socket.on('connect_error', () => {
      this.isConnecting = false;
    });

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.isConnecting = false;
  }

  getSocket() {
    return this.socket;
  }

  registerDriver(driverId: string) {
    this.socket?.emit('register-driver', { driverId });
  }

  trackDriver(driverId: string) {
    this.socket?.emit('track-driver', { driverId });
  }

  updateLocation(driverId: string, longitude: number, latitude: number) {
    this.socket?.emit('update-location', { driverId, longitude, latitude });
  }

  onLocationUpdated(
    callback: (payload: {
      driverId: string;
      longitude: number;
      latitude: number;
      timestamp: number;
    }) => void
  ) {
    this.socket?.on('location-updated', callback);
  }

  offLocationUpdated(callback?: (...args: any[]) => void) {
    if (callback) {
      this.socket?.off('location-updated', callback);
      return;
    }

    this.socket?.off('location-updated');
  }
}

export const socketService = new SocketService();
