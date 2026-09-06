import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationGateway } from './location.gateway';
import { LocationController } from './location.controller';
@Module({
  controllers: [LocationController],
  providers: [LocationGateway, LocationService],
  exports: [LocationService],
})
export class LocationModule {}
