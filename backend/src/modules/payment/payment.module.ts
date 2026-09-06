import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { NotificationModule } from '../notification/notification.module';
@Module({
  imports: [NotificationModule],
  controllers: [PaymentController, WebhookController],
  providers: [PaymentService, WebhookService],
  exports: [PaymentService],
})
export class PaymentModule {}
