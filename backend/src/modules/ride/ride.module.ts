import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
@Module({
  controllers: [RideController, ScheduleController],
  providers: [RideService, ScheduleService],
  exports: [RideService],
})
export class RideModule {}
