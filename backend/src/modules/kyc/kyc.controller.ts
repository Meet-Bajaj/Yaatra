import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { KycService } from './kyc.service';

interface AuthRequest {
  user: { userId: string; phone: string; role: string };
}

@ApiTags('kyc')
@Controller('users/me/documents')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @ApiOperation({ summary: 'Upload KYC document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'docType'],
      properties: {
        file: { type: 'string', format: 'binary' },
        docType: {
          type: 'string',
          enum: ['AADHAAR', 'DRIVING_LICENSE', 'PAN'],
        },
      },
    },
  })
  async uploadDocument(
    @Req() req: AuthRequest,
    @UploadedFile()
    file: { buffer: Buffer; originalname: string; mimetype: string },
    @Body('docType') docType: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!docType) {
      throw new BadRequestException('Document type is required');
    }

    return this.kycService.uploadDocument(req.user.userId, file, docType);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my KYC documents' })
  getDocuments(@Req() req: AuthRequest) {
    return this.kycService.getDocuments(req.user.userId);
  }

  @Get(':documentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific document' })
  getDocument(
    @Req() req: AuthRequest,
    @Param('documentId') documentId: string,
  ) {
    return this.kycService.getDocument(req.user.userId, documentId);
  }

  @Delete(':documentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a pending document' })
  deleteDocument(
    @Req() req: AuthRequest,
    @Param('documentId') documentId: string,
  ) {
    return this.kycService.deleteDocument(req.user.userId, documentId);
  }
}
