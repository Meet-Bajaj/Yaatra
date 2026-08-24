import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { randomUUID } from 'crypto';
import { extname } from 'path';

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
}

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger = new Logger(S3Service.name);
  private minioClient: Minio.Client;
  private bucket: string;
  private isAvailable = false;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    this.bucket = this.config.get<string>('minio.bucket', 'yaatra-documents');

    this.minioClient = new Minio.Client({
      endPoint: this.config.get<string>('minio.endpoint', 'localhost'),
      port: this.config.get<number>('minio.port', 9000),
      useSSL: this.config.get<boolean>('minio.useSSL', false),
      accessKey: this.config.get<string>('minio.accessKey', 'minioadmin'),
      secretKey: this.config.get<string>('minio.secretKey', 'minioadmin'),
    });

    try {
      await this.ensureBucket();
      this.isAvailable = true;
      this.logger.log(`MinIO connected — bucket: ${this.bucket}`);
    } catch (err) {
      const error = err as Error;
      this.logger.warn(
        `MinIO unavailable (${error.message}). File uploads will fail until MinIO is running.`,
      );
    }
  }

  private checkAvailable() {
    if (!this.isAvailable) {
      throw new Error(
        'MinIO is not available. Please start MinIO and restart the application.',
      );
    }
  }

  private async ensureBucket() {
    const exists = await this.minioClient.bucketExists(this.bucket);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucket, 'ap-south-1');
      this.logger.log(`Created bucket: ${this.bucket}`);

      // Set public read policy for document access
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucket}/*`],
          },
        ],
      };
      await this.minioClient.setBucketPolicy(
        this.bucket,
        JSON.stringify(policy),
      );
    }
  }

  /**
   * Upload a file to MinIO
   */
  async uploadFile(
    file: { buffer: Buffer; originalname: string; mimetype: string },
    folder: string = 'uploads',
  ): Promise<UploadResult> {
    this.checkAvailable();

    const ext = extname(file.originalname);
    const key = `${folder}/${randomUUID()}${ext}`;

    await this.minioClient.putObject(
      this.bucket,
      key,
      file.buffer,
      file.buffer.length,
      { 'Content-Type': file.mimetype },
    );

    const url = this.getPublicUrl(key);

    this.logger.log(`Uploaded: ${key}`);

    return { key, url, bucket: this.bucket };
  }

  /**
   * Delete a file from MinIO
   */
  async deleteFile(key: string): Promise<void> {
    this.checkAvailable();
    await this.minioClient.removeObject(this.bucket, key);
    this.logger.log(`Deleted: ${key}`);
  }

  /**
   * Get a presigned URL for temporary access (expires in seconds)
   */
  async getPresignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    this.checkAvailable();
    return this.minioClient.presignedGetObject(this.bucket, key, expiresIn);
  }

  /**
   * Get the public URL for a file
   */
  getPublicUrl(key: string): string {
    const protocol = this.config.get<boolean>('minio.useSSL', false)
      ? 'https'
      : 'http';
    const endpoint = this.config.get<string>('minio.endpoint', 'localhost');
    const port = this.config.get<number>('minio.port', 9000);
    return `${protocol}://${endpoint}:${port}/${this.bucket}/${key}`;
  }

  /**
   * Check if a file exists
   */
  async fileExists(key: string): Promise<boolean> {
    if (!this.isAvailable) return false;
    try {
      await this.minioClient.statObject(this.bucket, key);
      return true;
    } catch {
      return false;
    }
  }
}
