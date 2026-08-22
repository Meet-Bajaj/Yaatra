import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('charge')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Charge rider for a trip' })
  charge() {
    return { message: 'TODO: implement charge' };
  }

  @Post('payout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Driver payout' })
  payout() {
    return { message: 'TODO: implement payout' };
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Payment transaction history' })
  getHistory() {
    return { message: 'TODO: implement payment history' };
  }

  @Post('retry')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retry a failed payment' })
  retry() {
    return { message: 'TODO: implement payment retry' };
  }

  @Post('dispute')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Raise fare dispute' })
  dispute() {
    return { message: 'TODO: implement dispute' };
  }
}
