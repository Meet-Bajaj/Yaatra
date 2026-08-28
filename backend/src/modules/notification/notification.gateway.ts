import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendNotification(userId: string, notification: unknown) {
    this.server?.to(`user:${userId}`).emit('notification', notification);
  }

  sendUnreadCount(userId: string, count: number) {
    this.server?.to(`user:${userId}`).emit('unread_count', { count });
  }
}
