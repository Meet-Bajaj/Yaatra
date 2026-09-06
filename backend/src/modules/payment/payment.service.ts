import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { FARE_CONSTANTS } from '../../common/constants/fare.constants';
import Razorpay from 'razorpay';
import crypto from 'crypto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private razorpay: Razorpay | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly notificationService: NotificationService,
  ) {
    const keyId = this.config.get<string>('razorpay.keyId');
    const keySecret = this.config.get<string>('razorpay.keySecret');

    if (keyId && keySecret) {
      this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      this.logger.log('Razorpay initialized');
    } else {
      this.logger.warn('Razorpay not configured — payments in sandbox mode');
    }
  }

  // ─── Charge (On-Demand Trip) ────────────────────────────────

  async charge(userId: string, tripId: string, paymentMethod: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        rider: { select: { id: true, name: true } },
        payments: true,
      },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.riderId !== userId) {
      throw new BadRequestException('Not your trip');
    }
    if (trip.status !== 'COMPLETED') {
      throw new BadRequestException('Trip is not completed');
    }

    // Check if already paid
    const existingPayment = trip.payments.find(
      (p) => p.type === 'CAPTURE' && p.status === 'SUCCEEDED',
    );
    if (existingPayment) {
      throw new BadRequestException('Trip already paid');
    }

    const amount = Number(trip.fareFinal || trip.fareEstimate);

    if (paymentMethod === 'wallet') {
      return this.payFromWallet(userId, tripId, amount);
    }

    // Razorpay payment
    const payment = await this.createRazorpayPayment(
      tripId,
      amount,
      `Trip ${tripId}`,
    );

    return {
      paymentId: payment.id,
      amount,
      currency: 'INR',
      status: 'PENDING',
      tripId,
    };
  }

  // ─── Webhook Handler ────────────────────────────────────────

  async handleWebhook(body: Record<string, unknown>, signature: string) {
    if (!this.razorpay) {
      throw new BadRequestException('Payment gateway not configured');
    }

    // Verify signature
    const secret = this.config.get<string>('razorpay.keySecret') || '';
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (signature !== expectedSig) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = body.event as string;
    const payload = body.payload as Record<string, unknown>;
    const paymentEntity = payload.payment as Record<string, unknown>;
    const notes = paymentEntity.notes as Record<string, string> | undefined;
    const tripId = notes?.tripId;

    if (event === 'payment.captured' && tripId) {
      await this.capturePayment(tripId, paymentEntity.id as string);
    } else if (event === 'payment.failed' && tripId) {
      await this.markPaymentFailed(tripId, paymentEntity.id as string);
    }

    return { status: 'ok' };
  }

  // ─── Payout ─────────────────────────────────────────────────

  async payout(driverId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: driverId },
    });

    if (!wallet || Number(wallet.balance) < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    // Deduct from wallet
    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { userId: driverId },
        data: { balance: { decrement: amount } },
      }),
      this.prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount,
          type: 'DEBIT',
          referenceId: `payout-${Date.now()}`,
        },
      }),
    ]);

    this.logger.log(`Payout ₹${amount} to driver ${driverId}`);

    return {
      message: 'Payout initiated',
      amount,
      driverId,
      status: 'PROCESSING',
    };
  }

  // ─── History ────────────────────────────────────────────────

  async getHistory(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: {
        OR: [{ trip: { riderId: userId } }, { trip: { driverId: userId } }],
      },
      include: {
        trip: {
          select: {
            id: true,
            pickupAddress: true,
            dropAddress: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return payments;
  }

  // ─── Retry ──────────────────────────────────────────────────

  async retry(userId: string, tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: { payments: true },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.riderId !== userId) {
      throw new BadRequestException('Not your trip');
    }

    // Find failed payment
    const failedPayment = trip.payments.find((p) => p.status === 'FAILED');

    if (!failedPayment) {
      throw new BadRequestException('No failed payment to retry');
    }

    const amount = Number(failedPayment.amount);

    return this.createRazorpayPayment(tripId, amount, `Retry trip ${tripId}`);
  }

  // ─── Dispute ────────────────────────────────────────────────

  async dispute(userId: string, tripId: string, reason: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: { payments: true },
    });

    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.riderId !== userId) {
      throw new BadRequestException('Not your trip');
    }

    const payment = trip.payments.find(
      (p) => p.type === 'CAPTURE' && p.status === 'SUCCEEDED',
    );

    if (!payment) {
      throw new BadRequestException('No successful payment to dispute');
    }

    const dispute = await this.prisma.dispute.create({
      data: {
        bookingId: '', // On-demand trips don't have bookings
        raisedBy: userId,
        reason: `Trip ${tripId}: ${reason}`,
        status: 'OPEN',
      },
    });

    // Notify admin
    await this.notificationService.create({
      userId: 'admin',
      type: 'DISPUTE_RAISED',
      payload: {
        disputeId: dispute.id,
        tripId,
        raisedBy: userId,
        reason,
      },
    });

    return dispute;
  }

  // ─── Helpers ────────────────────────────────────────────────

  private async createRazorpayPayment(
    tripId: string,
    amount: number,
    _description: string,
  ) {
    if (!this.razorpay) {
      // Sandbox mode — auto-capture
      const payment = await this.prisma.payment.create({
        data: {
          tripId,
          amount,
          type: 'CAPTURE',
          status: 'SUCCEEDED',
          providerTransactionId: `sandbox-${Date.now()}`,
        },
      });

      await this.capturePayment(tripId, payment.providerTransactionId || '');

      return {
        id: payment.id,
        amount,
        status: 'SUCCEEDED',
        sandbox: true,
      };
    }

    // Real Razorpay order
    const order = await this.razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: 'INR',
      notes: { tripId },
    });

    await this.prisma.payment.create({
      data: {
        tripId,
        amount,
        type: 'AUTH',
        status: 'PENDING',
        providerTransactionId: order.id,
      },
    });

    return {
      orderId: order.id,
      amount,
      currency: 'INR',
    };
  }

  private async capturePayment(tripId: string, providerTxnId: string) {
    await this.prisma.payment.updateMany({
      where: { tripId, providerTransactionId: providerTxnId },
      data: { status: 'SUCCEEDED', type: 'CAPTURE' },
    });

    // Update trip
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (trip) {
      const amount = Number(trip.fareFinal || trip.fareEstimate);
      const commission = amount * FARE_CONSTANTS.PRO_COMMISSION_MIN;
      const driverPayout = amount - commission;

      // Credit driver wallet
      const driverWallet = await this.prisma.wallet.findUnique({
        where: { userId: trip.driverId || '' },
      });

      if (driverWallet) {
        await this.prisma.$transaction([
          this.prisma.wallet.update({
            where: { userId: trip.driverId || '' },
            data: { balance: { increment: driverPayout } },
          }),
          this.prisma.walletTransaction.create({
            data: {
              walletId: driverWallet.id,
              amount: driverPayout,
              type: 'TOPUP',
              referenceId: tripId,
            },
          }),
        ]);
      }
    }

    this.logger.log(`Payment captured for trip ${tripId}`);
  }

  private async markPaymentFailed(tripId: string, providerTxnId: string) {
    await this.prisma.payment.updateMany({
      where: { tripId, providerTransactionId: providerTxnId },
      data: { status: 'FAILED' },
    });

    this.logger.warn(`Payment failed for trip ${tripId}`);
  }

  private async payFromWallet(userId: string, tripId: string, amount: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || Number(wallet.balance) < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { userId },
        data: { balance: { decrement: amount } },
      }),
      this.prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount,
          type: 'DEBIT',
          referenceId: tripId,
        },
      }),
      this.prisma.payment.create({
        data: {
          tripId,
          amount,
          type: 'CAPTURE',
          status: 'SUCCEEDED',
          providerTransactionId: `wallet-${Date.now()}`,
        },
      }),
    ]);

    return { message: 'Paid from wallet', amount, tripId };
  }
}
