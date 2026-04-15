import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const LOCALHOST = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

class SocketService {
  public socket: Socket | null = null;

  async connect() {
    if (this.socket?.connected) return;

    const token = await SecureStore.getItemAsync('token');
    
    this.socket = io(`${LOCALHOST}/driver-location`, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('connect_error', (err) => {
      console.log('Socket connection error:', err.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
