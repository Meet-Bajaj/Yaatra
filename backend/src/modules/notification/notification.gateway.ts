import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Client should join their own room: client.join(`user:${userId}`)
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    await client.join(`user:${data.userId}`);
    this.logger.log(`Client ${client.id} joined room user:${data.userId}`);
    return { event: 'joined', data: { userId: data.userId } };
  }

  @SubscribeMessage('leave')
  async handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    await client.leave(`user:${data.userId}`);
    return { event: 'left', data: { userId: data.userId } };
  }

  /**
   * Push a notification to a specific user.
   */
  sendNotification(userId: string, notification: unknown) {
    this.server?.to(`user:${userId}`).emit('notification', notification);
  }

  /**
   * Push unread count update to a specific user.
   */
  sendUnreadCount(userId: string, count: number) {
    this.server?.to(`user:${userId}`).emit('unread_count', { count });
  }

  /**
   * Broadcast an event to all connected clients in a room.
   */
  broadcastToRoom(room: string, event: string, data: unknown) {
    this.server?.to(room).emit(event, data);
  }
}
