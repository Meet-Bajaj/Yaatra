import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';

interface AuthRequest {
  user: { userId: string; phone: string; role: string };
}

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('charge')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Charge rider for trip', description: 'Initiates a payment charge against the rider wallet or linked payment method for a completed trip. Returns payment confirmation.' })
  @ApiResponse({ status: 200, description: 'Payment charged successfully.' })
  @ApiResponse({ status: 400, description: 'Insufficient balance or invalid payment method.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  charge(
    @Req() req: AuthRequest,
    @Body() body: { tripId: string; paymentMethod: string },
  ) {
    return this.paymentService.charge(
      req.user.userId,
      body.tripId,
      body.paymentMethod,
    );
  }

  @Post('payout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate driver payout', description: 'Transfers earned funds from the driver wallet to their linked bank account. Minimum payout is ₹100.' })
  @ApiResponse({ status: 200, description: 'Payout initiated. Funds arrive in 1–3 business days.' })
  @ApiResponse({ status: 400, description: 'Insufficient wallet balance.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  payout(@Req() req: AuthRequest, @Body() body: { amount: number }) {
    return this.paymentService.payout(req.user.userId, body.amount);
  }

  @Get('history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment history', description: 'Returns paginated list of all payment transactions including charges, payouts, refunds, and disputes for the current user.' })
  @ApiResponse({ status: 200, description: 'Payment history returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  getHistory(@Req() req: AuthRequest) {
    return this.paymentService.getHistory(req.user.userId);
  }

  @Post('retry')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retry failed payment', description: 'Retries a previously failed payment for a trip. Uses the same payment method and amount.' })
  @ApiResponse({ status: 200, description: 'Payment retried successfully.' })
  @ApiResponse({ status: 400, description: 'No failed payment found for this trip.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  retry(@Req() req: AuthRequest, @Body() body: { tripId: string }) {
    return this.paymentService.retry(req.user.userId, body.tripId);
  }

  @Post('dispute')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'File fare dispute', description: 'Opens a dispute for a trip payment with a reason. The admin team reviews and resolves within 48 hours.' })
  @ApiResponse({ status: 201, description: 'Dispute filed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid dispute reason or trip not eligible.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  dispute(
    @Req() req: AuthRequest,
    @Body() body: { tripId: string; reason: string },
  ) {
    return this.paymentService.dispute(
      req.user.userId,
      body.tripId,
      body.reason,
    );
  }
}
