import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KycService } from './kyc.service';

@ApiTags('kyc')
@Controller('users/me/documents')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload KYC document' })
  uploadDocument() {
    return { message: 'TODO: implement document upload' };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my KYC documents' })
  getDocuments() {
    return { message: 'TODO: implement get documents' };
  }
}
