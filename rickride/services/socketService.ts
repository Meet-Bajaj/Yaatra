import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../store/useAuthStore';

// Retrieve socket URL from environment variable
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private isConnecting: boolean = false;

  /**
   * Initialize and connect the socket using the JWT auth token
   */
  async connect() {
    if (this.socket?.connected || this.isConnecting) return;

    this.isConnecting = true;
    try {
      const token = await getAuthToken();

      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'], // Prefer WebSocket over polling for React Native
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
        this.isConnecting = false;
      });

      this.socket.on('connect_error', (err: Error) => {
        console.error('Socket connection error:', err.message);
        this.isConnecting = false;
      });

      this.socket.on('disconnect', (reason: string) => {
        console.log('Socket disconnected:', reason);
        this.isConnecting = false;
      });
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      this.isConnecting = false;
    }
  }

  /**
   * Disconnect the socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Get the active socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Emit an event
   */
  emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit '${event}'. Socket is not connected.`);
    }
  }

  /**
   * Listen for an event
   */
  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  /**
   * Remove listener for an event
   */
  off(event: string, callback?: (...args: any[]) => void) {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }
}

export const socketService = new SocketService();
