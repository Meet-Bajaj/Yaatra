import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';

@ApiTags('payments-webhook')
@Controller('payments')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Payment gateway webhook callback' })
  handleWebhook(@Body() _body: Record<string, unknown>) {
    return { message: 'TODO: implement webhook handler' };
  }
}
