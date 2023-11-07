import { Injectable } from '@nestjs/common';

import { getEnv } from '../utils';

type ConfigKeys =
  | 'PUBLIC_URL'
  | 'GCP_SERVICE_ACCOUNT'
  | 'INTERCOM_CLIENT_ID'
  | 'INTERCOM_CLIENT_SECRET'
  | 'INTERCOM_CALLBACK_URL'
  | 'INTERCOM_ACCESS_TOKEN'
  | 'JWT_SECRET'
  | 'JWT_SECRET_ZENDESK'
  | 'POSTMARK_SERVER_TOKEN'
  | 'POSTMARK_FROM_EMAIL'
  | 'POSTMARK_VIDEO_RECORDING_TEMPLATE_ID'
  | 'POSTMARK_VIDEO_RECORDING_TEMPLATE_ALIAS'
  | 'POSTMARK_INTERCOM_INSTALL_TEMPLATE_ID'
  | 'POSTMARK_INTERCOM_INSTALL_TEMPLATE_ALIAS'
  | 'POSTMARK_ZENDESK_INSTALL_TEMPLATE_ID'
  | 'POSTMARK_ZENDESK_INSTALL_TEMPLATE_ALIAS'
  | 'POSTMARK_CREATE_ACCOUNT_TEMPLATE_ALIAS'
  | 'POSTMARK_CREATE_ACCOUNT_TEMPLATE_ID'
  | 'GOOGLE_CLIENT_ID'
  | 'GOOGLE_CLIENT_SECRET'
  | 'GOOGLE_CALLBACK_URL'
  | 'HUBSPOT_CLIENT_ID'
  | 'HUBSPOT_CLIENT_SECRET'
  | 'HUBSPOT_REDIRECT_URI'
  | 'POSTMARK_SEND_LINK_TEMPLATE_ALIAS'
  | 'POSTMARK_SEND_LINK_TEMPLATE_ID'
  | 'POSTMARK_VIDEO_RECORDING_SUPPORT_TEMPLATE_ID'
  | 'POSTMARK_VIDEO_RECORDING_SUPPORT_TEMPLATE_ALIAS'
  | 'AWS_REGION'
  | 'AWS_ACCESS_KEY_ID'
  | 'AWS_SECRET_ACCESS_KEY'
  | 'AWS_S3_BUCKET_ORIGINAL'
  | 'AWS_S3_BUCKET_COMPRESSED'
  | 'AWS_S3_BUCKET_THUMBNAILS'
  | 'AWS_S3_BUCKET_LOGOS'
  | 'ZENDESK_PUBLIC_KEY'
  | 'CRISP_ID'
  | 'CRISP_SECRET'
  | 'STRIPE_SECRET_KEY';

@Injectable()
export class ConfigService {
  private env: NodeJS.ProcessEnv = {};

  constructor() {
    this.env = getEnv();
  }

  getString<T extends ConfigKeys>(name: T): string | undefined;
  getString<T extends ConfigKeys>(name: T, fallback: string | false): string;
  getString<T extends ConfigKeys>(name: T, fallback?: string | false) {
    const value = this.env[name] as string | undefined;

    if (value === undefined && fallback === false) {
      throw new Error(
        `The variable '${name}' could not be found in the configuration and no fallback was provided`
      );
    }

    return value || fallback;
  }

  getNumber<T extends ConfigKeys>(name: T): number | undefined;
  getNumber<T extends ConfigKeys>(name: T, fallback: number | false): number;
  getNumber<T extends ConfigKeys>(name: T, fallback?: number | false) {
    const value = this.env[name] as string | undefined;

    if (value === undefined && fallback === false) {
      throw new Error(
        `The variable '${name}' could not be found in the configuration and no fallback was provided`
      );
    }

    return value !== undefined ? parseInt(value, 10) : fallback;
  }
}
