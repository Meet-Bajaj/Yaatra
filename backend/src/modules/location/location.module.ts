import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationGateway } from './location.gateway';
import { LocationController } from './location.controller';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [LocationController],
  providers: [LocationGateway, LocationService],
  exports: [LocationService],
})
export class LocationModule {}
