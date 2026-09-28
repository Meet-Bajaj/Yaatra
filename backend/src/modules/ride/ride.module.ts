import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
@Module({
  // ScheduleController must register BEFORE RideController so the exact
  // "rides/schedules" route wins over RideController's "rides/:id" wildcard.
  controllers: [ScheduleController, RideController],
  providers: [RideService, ScheduleService],
  exports: [RideService],
})
export class RideModule {}
