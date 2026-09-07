import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';

interface AuthRequest {
  user: { userId: string; phone: string; role: string };
}

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get wallet balance', description: 'Returns current wallet balance, total top-ups, total withdrawals, and recent transaction summary for the authenticated user.' })
  @ApiResponse({ status: 200, description: 'Wallet balance and summary returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  getBalance(@Req() req: AuthRequest) {
    return this.walletService.getBalance(req.user.userId);
  }

  @Post('topup')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Top up wallet', description: 'Adds funds to the user wallet via Razorpay payment gateway. Minimum top-up amount is ₹10.' })
  @ApiResponse({ status: 201, description: 'Wallet topped up successfully. Returns updated balance.' })
  @ApiResponse({ status: 400, description: 'Invalid amount or payment failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  topup(@Req() req: AuthRequest, @Body() body: { amount: number }) {
    return this.walletService.topup(req.user.userId, body.amount);
  }

  @Get('transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get wallet transactions', description: 'Returns paginated list of all wallet transactions including top-ups, ride payments, driver payouts, and refunds.' })
  @ApiResponse({ status: 200, description: 'Transaction history returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  getTransactions(@Req() req: AuthRequest) {
    return this.walletService.getTransactions(req.user.userId);
  }

  @Post('withdraw')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Withdraw wallet balance', description: 'Transfers funds from wallet to the driver linked bank account. Minimum withdrawal is ₹100. Only available for verified driver accounts.' })
  @ApiResponse({ status: 200, description: 'Withdrawal initiated successfully. Funds will arrive in 1–3 business days.' })
  @ApiResponse({ status: 400, description: 'Insufficient balance or invalid amount.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  withdraw(@Req() req: AuthRequest, @Body() body: { amount: number }) {
    return this.walletService.withdraw(req.user.userId, body.amount);
  }
}
