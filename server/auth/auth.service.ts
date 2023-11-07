import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { S3, config as AwsConfig } from 'aws-sdk';

import { ConfigService } from '../config/config.service';
import { Client } from '../database/client/client.model';
import { DatabaseService } from '../database/database.service';
import { createReadStream } from 'fs';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  private readonly jwtSignKey: string;
  private readonly jwtAuthorizedKeys: string[];
  private readonly s3Client: S3;
  private readonly awsDefaultExpirationInSeconds: number;
  private readonly awsDefaultExpirationInMilliseconds: number;
  private bucketName: string;
  private bucketNameCompressed: string;
  private bucketNameThumb: string;
  private bucketNameLogos: string;

  constructor(
    @Inject(forwardRef(() => DatabaseService))
    private readonly databaseService: DatabaseService,
    configService: ConfigService
  ) {
    this.jwtSignKey = configService.getString('JWT_SECRET', false);
    const jwtZendeskKey = configService.getString('JWT_SECRET_ZENDESK', false);

    this.jwtAuthorizedKeys = [this.jwtSignKey, jwtZendeskKey];

    AwsConfig.update({
      accessKeyId: configService.getString('AWS_ACCESS_KEY_ID', false),
      secretAccessKey: configService.getString('AWS_SECRET_ACCESS_KEY', false),
      signatureVersion: 'v4',
      region: configService.getString('AWS_REGION', false),
    });
    AwsConfig.getCredentials((err) => {
      if (err) {
        console.error(err.stack);
      }
    });
    this.s3Client = new S3({
      apiVersion: '2006-03-01',
      useAccelerateEndpoint: true,
    });
    this.bucketName = configService.getString('AWS_S3_BUCKET_ORIGINAL', false);
    this.bucketNameCompressed = configService.getString(
      'AWS_S3_BUCKET_COMPRESSED',
      false
    );
    this.bucketNameThumb = configService.getString(
      'AWS_S3_BUCKET_THUMBNAILS',
      false
    );

    this.bucketNameLogos = configService.getString(
      'AWS_S3_BUCKET_LOGOS',
      false
    );
    // AWS links expire in one day
    this.awsDefaultExpirationInSeconds = 60 * 60 * 24;
    this.awsDefaultExpirationInMilliseconds =
      this.awsDefaultExpirationInSeconds * 1000;
  }

  async signPayload(payload: any, role: string, options?: SignOptions) {
    const finalPayload = {
      ...payload,
      role,
    };
    return sign(finalPayload, this.jwtSignKey, options);
  }

  async presignedS3PutVideo(id: string) {
    const params = {
      Bucket: this.bucketName,
      Key: `${id}.mp4`,
      Expires: this.awsDefaultExpirationInSeconds,
    };
    return {
      url: this.s3Client.getSignedUrl('putObject', params),
      expiration: Date.now() + this.awsDefaultExpirationInMilliseconds,
    };
  }

  async createMultipartS3(id: string) {
    const params = {
      Bucket: this.bucketName,
      Key: `${id}.mp4`,
    };
    const res = await this.s3Client.createMultipartUpload(params).promise();
    return res.UploadId;
  }

  async completeMultiPart(
    id: string,
    uploadId: string,
    parts: {
      ETag: string;
      PartNumber: number;
    }[]
  ) {
    const params = {
      Bucket: this.bucketName,
      Key: `${id}.mp4`,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    };

    const res = await this.s3Client.completeMultipartUpload(params).promise();
    return res;
  }

  async presignedS3PutVideoPart(
    id: string,
    uploadId: string,
    partNumber: number
  ) {
    const params = {
      Bucket: this.bucketName,
      Key: `${id}.mp4`,
      UploadId: uploadId,
      PartNumber: partNumber,
    };
    return {
      url: this.s3Client.getSignedUrl('uploadPart', params),
      expiration: Date.now() + this.awsDefaultExpirationInMilliseconds,
    };
  }
  async uploadLogoS3(filename: string, filePath: string) {
    const file = createReadStream(filePath);
    const params = {
      Bucket: this.bucketNameLogos,
      Key: filename,
      Body: file,
    };
    const upload = await this.s3Client.upload(params).promise();
    const data = upload.Location;
    if (data) {
      return {
        status: 'ok',
        url: data,
      };
    } else {
      return {
        status: 'error',
        message: 'Could not upload to S3 bucket',
      };
    }
  }

  async presignedS3GetVideo(id: string) {
    const params = {
      Bucket: this.bucketName,
      Key: `${id}.mp4`,
      Expires: this.awsDefaultExpirationInSeconds,
    };
    const url = this.s3Client.getSignedUrl('getObject', params);
    return {
      url,
      expiration: Date.now() + this.awsDefaultExpirationInMilliseconds,
    };
  }

  async S3GetThumb(id: string) {
    const filename = `${id}.0000000.jpg`;
    const params = {
      Bucket: this.bucketNameThumb,
      CopySource: `/${this.bucketNameThumb}/placeholder.jpg`,
      Key: filename,
    };
    this.s3Client.copyObject(params, (err, data) => {});
    const url = `https://${this.bucketNameThumb}.s3.amazonaws.com/${filename}`;
    return {
      url,
    };
  }

  async presignedS3GetVideoCompressed(id: string) {
    const params = {
      Bucket: this.bucketNameCompressed,
      Key: `${id}.mp4`,
      Expires: this.awsDefaultExpirationInSeconds,
    };
    return {
      url: this.s3Client.getSignedUrl('getObject', params),
      expiration: Date.now() + this.awsDefaultExpirationInMilliseconds,
    };
  }

  async sign(
    clientId: string,
    id: string,
    name: string,
    email: string,
    provider: Provider,
    role: string
  ): Promise<string> {
    try {
      const payload = {
        clientId,
        id,
        name,
        email,
        provider,
        role,
      };

      const oneDay = 60 * 60 * 24;

      const jwt = sign(payload, this.jwtSignKey, {
        expiresIn: oneDay,
      }); // 1 day
      return jwt;
    } catch (err) {
      throw new InternalServerErrorException(
        'validateOAuthLogin',
        (err as any).message
      );
    }
  }

  async verify(token: string): Promise<any> {
    for (const secret of this.jwtAuthorizedKeys) {
      try {
        const payload = verify(token, secret);
        // as soon as we get a successful verified signature, we return
        // the corresponding payload
        return payload;
      } catch (_) {
        // just try the next key
      }
    }
    // if we finished the loop without a return, the signature
    // doesn't correspond to any of the authorized keys, so we
    // must throw an error
    throw new InternalServerErrorException('validateOAuthLogin');
  }

  async authorizedClient(client: Client) {
    const pricingPlan = client.pricingPlan;

    const features: any = await this.databaseService.getPricingPlan(
      pricingPlan
    );

    const pricing = {
      customBranding: features.custom_branding,
      emailConfirmation: features.email_confirmation,
      integrations: features.integrations,
      recordings: features.recordings,
    };
    let featuresSend = {};

    if (Object.keys(features).length !== 0) {
      featuresSend = {
        ...featuresSend,
        ...pricing,
      };
      if (features.custom_branding) {
        const branding = {
          logo: client.settings.app.branding.logo,
          primaryColour: client.settings.app.branding.primary_colour,
          secondaryColour:
            client.settings.app.branding.secondary_colour || '#FFFFFF',
        };
        const referrer = client.settings.app.referrerUrl;

        featuresSend = {
          ...featuresSend,
          ...{ branding, referrer },
        };
      }
    }
    return featuresSend;
  }

  defaultFeatures() {
    const features = {
      customBranding: false,
      emailConfirmation: false,
      integrations: {},
      recordings: {},
    };

    return features;
  }

  async authorizedLink(linkId: string) {
    const link = await this.databaseService.getLinkById(linkId);
    if (link.clientId) {
      const client = await this.databaseService.getClientByClientId(
        link.clientId
      );

      if (client === undefined || client.data === undefined) {
        console.error('[auth/authorizedLink] Client not found');
        throw new UnauthorizedException('Client not found');
      }

      return this.authorizedClient(client.data);
    } else {
      return this.defaultFeatures();
    }
  }
}
