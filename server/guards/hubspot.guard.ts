import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { ConfigService } from '../config/config.service';
import * as rawbody from 'raw-body';

@Injectable()
export class HubSpotGuard implements CanActivate {
  publicUrl: string;
  clientSecret: string;

  constructor(configService: ConfigService) {
    this.publicUrl = configService.getString('PUBLIC_URL', false);
    this.clientSecret = configService.getString('HUBSPOT_CLIENT_SECRET', false);
  }
  v1(body: string, signature: string) {
    const str = this.clientSecret + body;
    const hash = createHash('sha256').update(str).digest('hex');
    return timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  }

  // Hubspot has two types of signature verification, v1 and v2
  // The functions correspond to checking each type
  v2(body: string, method: string, uri: string, signature: string) {
    const str = this.clientSecret + method + uri + body;
    const hash = createHash('sha256').update(str).digest('hex');
    return timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  }

  v3(
    body: string,
    method: string,
    uri: string,
    signature: string,
    timestamp: number
  ) {
    const _5minutes = 300;
    if (timestamp < Date.now() - _5minutes) return false;
    const str = method + uri + body + `${timestamp}`;
    const hash = createHmac('sha256', this.clientSecret)
      .update(str)
      .digest('base64');
    return timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-hubspot-signature'];
    const raw = await rawbody(request);
    const body = raw.toString();
    const version = request.headers['x-hubspot-signature-version'];
    if (version === 'v1') {
      return this.v1(body, signature);
    } else if (version === 'v2') {
      const method = request.method;
      const uri = this.publicUrl + request.url;
      return this.v2(body, method, uri, signature);
    } else if (version === 'v3') {
      const method = request.method;
      const uri = this.publicUrl + request.url;
      const timestamp = parseInt(
        request.headers['x-hubspot-request-timestamp']
      );
      return this.v3(body, method, uri, signature, timestamp);
    } else {
      return false;
    }
  }
}
