import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { S3Service } from './s3.service';

@Module({
  controllers: [KycController],
  providers: [KycService, S3Service],
  exports: [KycService],
})
export class KycModule {}
