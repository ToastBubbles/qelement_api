import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT') as string,
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY') as string,
      secretKey: this.configService.get('MINIO_SECRET_KEY') as string,
    });
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME') as string;
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    console.log(this.minioClient, 'got here');
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'eu-west-1');
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    qpartId: number | null,
    userId: number,
    sculptureId: number | null,
    type: string,
  ) {
    function getType(filename: string): string {
      const dotIndex = filename.lastIndexOf('.');
      if (dotIndex === -1) {
        throw new Error('Invalid filename');
      }
      return filename.slice(dotIndex + 1);
    }
    let nameType = qpartId ? `q${qpartId}` : '';
    nameType.length == 0 && sculptureId
      ? (nameType = `s${sculptureId}`)
      : 'error';
    const fileName = `${Date.now()}-${nameType}-${userId}-${type}.${getType(
      file.originalname,
    )}`;
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
    );
    return fileName;
  }

  async getFileUrl(fileName: string) {
    return await this.minioClient.presignedGetObject(this.bucketName, fileName);
    // return await this.minioClient.presignedUrl(
    //   'GET',
    //   this.bucketName,
    //   fileName,
    // );
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
