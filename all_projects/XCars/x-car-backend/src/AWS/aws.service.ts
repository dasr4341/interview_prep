import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { HelperService } from 'src/helper/helper.service';
import { FileType } from 'src/common/types/upload-file-type';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { GraphQLError } from 'graphql';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { DocumentType } from '@prisma/client';

@Injectable()
export class AWSService {
  private s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private helperService: HelperService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      },
    });
  }

  async uploadFile({
    file,
    uploadCategory,
    id,
  }: {
    file: any;
    uploadCategory: FileType;
    id: string;
  }): Promise<string> {
    try {
      let allowedExtensions = [];
      if (FileType.DOCUMENTS === uploadCategory) {
        allowedExtensions = ['pdf', 'doc'];
      } else if (
        FileType.IMAGES === uploadCategory ||
        FileType.PROFILE_IMAGE === uploadCategory
      ) {
        allowedExtensions = ['png', 'jpg', 'jpeg'];
      }
      const fileName = file.filename.replace(/[^\w.](?=.*\.)/g, '_');
      this.helperService.checkExtension(file.filename, allowedExtensions);

      const key = `${uploadCategory}/${id}/${Date.now().toString()}-${fileName.trim()}`;

      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks = [];
        file
          .createReadStream()
          .on('data', (chunk) => chunks.push(chunk))
          .on('end', () => resolve(Buffer.concat(chunks)))
          .on('error', reject);
      });

      const putObjectCommand = new PutObjectCommand({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
        Key: key,
        Body: buffer,
        ContentType: file.mimetype,
      });

      const res = await this.s3Client.send(putObjectCommand);

      if (res.$metadata.httpStatusCode === 200) {
        const url = key;
        return url;
      } else {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.failed('file upload'),
        );
      }
    } catch (error) {
      throw error;
    }
  }

  getGalleryFileUrl(key: string): string {
    try {
      const url = `${this.configService.get<string>(
        'CLOUDFRONT_PUBLIC_DISTRIBUTION',
      )}/${key}`;
      return url;
    } catch (error) {
      throw error;
    }
  }

  getProductFileUrl(
    key: string,
    expiresInSeconds: number = this.configService.get<number>(
      'SIGNED_URL_EXPIRY',
    ),
  ): string {
    try {
      const cloudfrontDistributionDomain = this.configService.get<string>(
        'CLOUDFRONT_PRIVATE_DISTRIBUTION',
      );
      const s3ObjectKey = key;
      const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;
      const privateKey = this.configService
        .get<string>('CLOUDFRONT_PRIVATE_KEY')
        .replace(/\\n/g, '\n'); // Handle multiline private key in .env
      const keyPairId = this.configService.get<string>(
        'CLOUDFRONT_KEY_PAIR_ID',
      );
      const dateLessThan = new Date(
        Date.now() + expiresInSeconds * 1000,
      ).toString();
      const signedUrl = getSignedUrl({
        url,
        keyPairId,
        dateLessThan,
        privateKey,
      });
      return signedUrl;
    } catch (error) {
      throw error;
    }
  }

  async deleteFiles(paths: string[]) {
    try {
      const deleteObjectsCommand = new DeleteObjectsCommand({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
        Delete: {
          Objects: paths.map((each) => ({
            Key: each,
          })),
        },
      });

      const response = await this.s3Client.send(deleteObjectsCommand);
      if (response.$metadata.httpStatusCode === 200) {
        return {
          message: 'File deleted successfully',
          success: true,
        };
      }

      throw new GraphQLError('Failed to delete file', {
        extensions: { code: StatusCodes.BAD_REQUEST },
      });
    } catch (error) {
      throw error;
    }
  }

  signedProductDocuments(docs) {
    const signedPaths = [];
    for (const doc of docs) {
      if (doc.documentType !== DocumentType.VIDEO) {
        signedPaths.push({
          id: doc.id,
          fileName: doc.fileName,
          documentType: doc.documentType,
          path: this.getProductFileUrl(doc.path),
        });
      } else {
        signedPaths.push({
          id: doc.id,
          fileName: doc.fileName,
          documentType: doc.documentType,
          path: doc.path,
        });
      }
    }
    return signedPaths;
  }

  signedThumbnail(doc) {
    return this.getGalleryFileUrl(doc);
  }

  signedGalleryDocuments(docs) {
    const signedPaths = [];
    for (const doc of docs) {
      if (doc.documentType !== DocumentType.VIDEO) {
        signedPaths.push({
          id: doc.id,
          fileName: doc.fileName,
          documentType: doc.documentType,
          path: this.getGalleryFileUrl(doc.path),
        });
      } else {
        signedPaths.push({
          id: doc.id,
          fileName: doc.fileName,
          documentType: doc.documentType,
          path: doc.path,
        });
      }
    }
    return signedPaths;
  }
}
