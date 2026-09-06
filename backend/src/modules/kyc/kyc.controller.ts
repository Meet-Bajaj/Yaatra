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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiResponse,
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

  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @ApiOperation({ summary: 'Upload KYC document', description: 'Uploads an identity document (Aadhaar, Driving License, or PAN card) for KYC verification. Accepted formats: JPEG, PNG, PDF. Max 5MB.' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Document uploaded successfully. Status set to PENDING review.' })
  @ApiResponse({ status: 400, description: 'Invalid file type, file too large, or missing document type.' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get KYC documents', description: 'Returns all KYC documents uploaded by the current user along with their verification status (PENDING, APPROVED, REJECTED).' })
  @ApiResponse({ status: 200, description: 'KYC documents returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  getDocuments(@Req() req: AuthRequest) {
    return this.kycService.getDocuments(req.user.userId);
  }

  @Get(':documentId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific document', description: 'Returns a single KYC document with its verification status, upload date, and optional rejection reason.' })
  @ApiResponse({ status: 200, description: 'Document returned successfully.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  getDocument(
    @Req() req: AuthRequest,
    @Param('documentId') documentId: string,
  ) {
    return this.kycService.getDocument(req.user.userId, documentId);
  }

  @Delete(':documentId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a document', description: 'Deletes a KYC document. Only documents with PENDING status can be deleted. Approved documents cannot be removed.' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  deleteDocument(
    @Req() req: AuthRequest,
    @Param('documentId') documentId: string,
  ) {
    return this.kycService.deleteDocument(req.user.userId, documentId);
  }
}
