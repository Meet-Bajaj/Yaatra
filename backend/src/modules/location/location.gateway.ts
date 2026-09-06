import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { LocationService } from './location.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/trips',
})
export class LocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(LocationGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly locationService: LocationService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Location client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Location client disconnected: ${client.id}`);
  }

  /**
   * Driver/rider joins a trip room to receive location updates.
   */
  @SubscribeMessage('join:trip')
  async handleJoinTrip(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: string; userId: string },
  ) {
    const tripInfo = await this.locationService.getTripInfo(data.tripId);

    if (!tripInfo) {
      return { event: 'error', data: { message: 'Trip not found' } };
    }

    // Authorization: only rider or driver of this trip
    if (tripInfo.riderId !== data.userId && tripInfo.driverId !== data.userId) {
      return { event: 'error', data: { message: 'Not authorized' } };
    }

    await client.join(`trip:${data.tripId}`);
    this.logger.log(`Client ${client.id} joined trip:${data.tripId}`);

    return { event: 'joined', data: { tripId: data.tripId } };
  }

  /**
   * Driver sends location update → persist + broadcast to trip room.
   */
  @SubscribeMessage('location:update')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      tripId: string;
      userId: string;
      lat: number;
      lng: number;
      speed?: number;
    },
  ) {
    const tripInfo = await this.locationService.getTripInfo(data.tripId);

    if (!tripInfo) {
      return { event: 'error', data: { message: 'Trip not found' } };
    }

    // Only driver can send location updates
    if (tripInfo.driverId !== data.userId) {
      return {
        event: 'error',
        data: { message: 'Only driver can update location' },
      };
    }

    // Persist to DB
    const location = await this.locationService.updateLocation(
      data.tripId,
      data.lat,
      data.lng,
      data.speed,
    );

    // Broadcast to trip room
    this.server.to(`trip:${data.tripId}`).emit('trip.location', {
      tripId: data.tripId,
      lat: data.lat,
      lng: data.lng,
      speed: data.speed,
      recordedAt: location.recordedAt,
    });

    return { event: 'location.saved', data: { locationId: location.id } };
  }

  /**
   * Emit a trip lifecycle event to the trip room.
   */
  emitTripEvent(tripId: string, event: string, data: Record<string, unknown>) {
    this.server?.to(`trip:${tripId}`).emit(event, data);
  }
}
