import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { FARE_CONSTANTS } from '../../common/constants/fare.constants';
import crypto from 'crypto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Verify Razorpay webhook signature and process event.
   */
  async processWebhook(
    body: Record<string, unknown>,
    signature: string,
  ): Promise<{ status: string }> {
    const secret = this.config.get<string>('razorpay.keySecret') || '';

    // Verify signature
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (signature !== expectedSig) {
      this.logger.warn('Invalid webhook signature');
      return { status: 'invalid_signature' };
    }

    const event = body.event as string;
    const payload = body.payload as Record<string, unknown>;
    const paymentEntity = payload.payment as Record<string, unknown>;
    const notes = paymentEntity.notes as Record<string, string> | undefined;
    const tripId = notes?.tripId;

    this.logger.log(`Webhook received: ${event}`);

    if (event === 'payment.captured' && tripId) {
      await this.handlePaymentCaptured(
        tripId,
        paymentEntity.id as string,
        Number(paymentEntity.amount) / 100, // Convert paise to rupees
      );
    } else if (event === 'payment.failed' && tripId) {
      await this.handlePaymentFailed(tripId, paymentEntity.id as string);
    } else if (event === 'refund.created') {
      this.logger.log(`Refund created: ${String(paymentEntity.id)}`);
    }

    return { status: 'ok' };
  }

  private async handlePaymentCaptured(
    tripId: string,
    providerTxnId: string,
    amount: number,
  ) {
    // Update payment record
    await this.prisma.payment.updateMany({
      where: { tripId, providerTransactionId: providerTxnId },
      data: { status: 'SUCCEEDED', type: 'CAPTURE' },
    });

    // Credit driver wallet
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (trip?.driverId) {
      const commission = amount * FARE_CONSTANTS.PRO_COMMISSION_MIN;
      const driverPayout = amount - commission;

      const wallet = await this.prisma.wallet.findUnique({
        where: { userId: trip.driverId },
      });

      if (wallet) {
        await this.prisma.$transaction([
          this.prisma.wallet.update({
            where: { userId: trip.driverId },
            data: { balance: { increment: driverPayout } },
          }),
          this.prisma.walletTransaction.create({
            data: {
              walletId: wallet.id,
              amount: driverPayout,
              type: 'TOPUP',
              referenceId: tripId,
            },
          }),
        ]);

        this.logger.log(
          `Driver ${trip.driverId} credited ₹${driverPayout} for trip ${tripId}`,
        );
      }
    }
  }

  private async handlePaymentFailed(tripId: string, providerTxnId: string) {
    await this.prisma.payment.updateMany({
      where: { tripId, providerTransactionId: providerTxnId },
      data: { status: 'FAILED' },
    });

    this.logger.warn(`Payment failed for trip ${tripId}`);
  }
}
