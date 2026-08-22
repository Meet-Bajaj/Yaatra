import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { LocationService } from './location.service';

@WebSocketGateway()
export class LocationGateway {
  constructor(private readonly locationService: LocationService) {}

  @SubscribeMessage('location:update')
  handleLocationUpdate(
    @MessageBody()
    _data: { tripId: string; lat: number; lng: number; speed?: number },
    @ConnectedSocket() _client: Socket,
  ) {
    return { message: 'TODO: implement location update broadcast' };
  }

  @SubscribeMessage('join:trip')
  handleJoinTrip(
    @MessageBody() _data: { tripId: string },
    @ConnectedSocket() _client: Socket,
  ) {
    return { message: 'TODO: implement join trip room' };
  }
}
