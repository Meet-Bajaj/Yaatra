import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { S3Service } from './s3.service';

@Injectable()
export class KycService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * Upload a KYC document for a user
   */
  async uploadDocument(
    userId: string,
    file: { buffer: Buffer; originalname: string; mimetype: string },
    docType: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed: JPEG, PNG, WebP, PDF',
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.buffer.length > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    // Validate doc type
    const validDocTypes = ['AADHAAR', 'DRIVING_LICENSE', 'PAN'];
    if (!validDocTypes.includes(docType)) {
      throw new BadRequestException(
        `Invalid document type. Allowed: ${validDocTypes.join(', ')}`,
      );
    }

    // Upload to MinIO
    const uploadResult = await this.s3Service.uploadFile(file, `kyc/${userId}`);

    // Create document record
    const document = await this.prisma.kycDocument.create({
      data: {
        userId,
        type: docType as 'AADHAAR' | 'DRIVING_LICENSE' | 'PAN',
        s3Key: uploadResult.key,
        status: 'PENDING',
      },
    });

    return {
      id: document.id,
      type: document.type,
      status: document.status,
      uploadedAt: document.uploadedAt,
      fileUrl: uploadResult.url,
    };
  }

  /**
   * Get all KYC documents for a user
   */
  async getDocuments(userId: string) {
    const documents = await this.prisma.kycDocument.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });

    // Generate presigned URLs for each document
    const docsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const fileUrl = await this.s3Service.getPresignedUrl(doc.s3Key, 3600);
        return {
          id: doc.id,
          type: doc.type,
          status: doc.status,
          uploadedAt: doc.uploadedAt,
          verifiedAt: doc.verifiedAt,
          fileUrl,
        };
      }),
    );

    return docsWithUrls;
  }

  /**
   * Get a single document by ID (must belong to user)
   */
  async getDocument(userId: string, documentId: string) {
    const document = await this.prisma.kycDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.userId !== userId) {
      throw new NotFoundException('Document not found');
    }

    const fileUrl = await this.s3Service.getPresignedUrl(document.s3Key, 3600);

    return {
      id: document.id,
      type: document.type,
      status: document.status,
      uploadedAt: document.uploadedAt,
      verifiedAt: document.verifiedAt,
      fileUrl,
    };
  }

  /**
   * Delete a KYC document (only if PENDING review)
   */
  async deleteDocument(userId: string, documentId: string) {
    const document = await this.prisma.kycDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.userId !== userId) {
      throw new NotFoundException('Document not found');
    }

    if (document.status !== 'PENDING') {
      throw new BadRequestException(
        'Cannot delete a document that has already been reviewed',
      );
    }

    // Delete from MinIO
    await this.s3Service.deleteFile(document.s3Key);

    // Delete from database
    await this.prisma.kycDocument.delete({ where: { id: documentId } });

    return { message: 'Document deleted successfully' };
  }
}
