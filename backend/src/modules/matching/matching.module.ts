import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { CorridorService } from './corridor.service';

@Module({
  providers: [MatchingService, CorridorService],
  exports: [MatchingService],
})
export class MatchingModule {}
