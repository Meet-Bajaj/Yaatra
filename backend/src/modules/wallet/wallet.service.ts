import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Get Balance ────────────────────────────────────────────

  async getBalance(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    // Auto-create wallet if missing
    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: { userId },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });
    }

    return {
      walletId: wallet.id,
      balance: Number(wallet.balance),
      recentTransactions: wallet.transactions,
    };
  }

  // ─── Topup ──────────────────────────────────────────────────

  async topup(userId: string, amount: number) {
    if (amount <= 0 || amount > 50000) {
      throw new BadRequestException('Amount must be between ₹1 and ₹50,000');
    }

    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: { userId },
      });
    }

    // In production, this would trigger a Razorpay order
    // For now, auto-credit (sandbox mode)
    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { userId },
        data: { balance: { increment: amount } },
      }),
      this.prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount,
          type: 'TOPUP',
          referenceId: `topup-${Date.now()}`,
        },
      }),
    ]);

    this.logger.log(`Wallet topped up ₹${amount} for user ${userId}`);

    const updated = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    return {
      message: 'Wallet topped up successfully',
      balance: Number(updated?.balance || 0),
      amount,
    };
  }

  // ─── Transactions ───────────────────────────────────────────

  async getTransactions(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return { transactions: [], total: 0 };
    }

    const transactions = await this.prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      transactions,
      total: transactions.length,
    };
  }

  // ─── Withdraw ───────────────────────────────────────────────

  async withdraw(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (Number(wallet.balance) < amount) {
      throw new BadRequestException(
        `Insufficient balance. Available: ₹${Number(wallet.balance)}`,
      );
    }

    // Deduct from wallet
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
          referenceId: `withdraw-${Date.now()}`,
        },
      }),
    ]);

    this.logger.log(`Withdrawal ₹${amount} from user ${userId}`);

    const updated = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    return {
      message: 'Withdrawal initiated',
      amount,
      balance: Number(updated?.balance || 0),
      status: 'PROCESSING',
    };
  }
}
