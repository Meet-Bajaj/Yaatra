import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';

@Module({
  controllers: [DriverController, VehicleController],
  providers: [DriverService, VehicleService],
  exports: [DriverService],
})
export class DriverModule {}
