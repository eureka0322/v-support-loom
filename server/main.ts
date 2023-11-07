import * as bodyParser from 'body-parser';
import { join } from 'path';
import { Request, Response, urlencoded, json } from 'express';
import { NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  NotFoundException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as wwwhisper from 'connect-wwwhisper';
import * as helmet from 'helmet';
import * as morgan from 'morgan';

import { AppModule } from './app.module';

// Need to use a require because of some incompatiblity with nestjs
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  const rawBodyBuffer = (req: any, res: any, buffer: any, encoding: any) => {
    // we only need this for intercom requests
    if (!req.headers['x-body-signature']) {
      return;
    }

    if (buffer && buffer.length) {
      req.rawBody = buffer.toString(encoding || 'utf8');
    }
  };

  app.use(
    bodyParser.urlencoded({
      verify: rawBodyBuffer,
      extended: true,
      limit: '50mb',
    })
  );
  app.use(bodyParser.json({ verify: rawBodyBuffer, limit: '50mb' }));

  /* Add local host when developing */
  app.enableCors({
    origin: [
      'https://app.screensupport.io',
      'http://localhost:3005', //videosupport-web-dev
      'https://www.videosupport.io',
      'https://vsio-cv-eu1-staging.s3.eu-west-1.amazonaws.com',
      'https://vsio-cv-eu1.s3.eu-west-1.amazonaws.com',
      'https://5387dbf0343a.eu.ngrok.io',
      process.env.PUBLIC_URL as string,
    ],
  });
  /*
  app.use(
    helmet.frameguard({
      action: 'sameorigin',
    }),
    helmet.noSniff(),
    helmet.hsts({
      maxAge: 31536000,
      includeSubDomains: true,
    }),
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'frame-ancestors': ['self', '*.hubspot.com'],
        'media-src': ['self', '*.cloudinary.com'],
        'object-src': ['none'],
        'script-src': [
          'nonce-{random}',
          'unsafe-inline',
          'unsafe-eval',
          'strict-dynamic',
        ],
        'default-src': ['*', 'self', 'https://*.hubspot.com'],
        'img-src': ['*'],
        'media-src': ['self', '*', 'blob: data'],
      },
    })
  );
  */

  app.use(
    cookieSession({
      keys: [process.env.COOKIE_SESSION_KEY],
    })
  );

  if (process.env.USE_WWWHISPER && process.env.USE_WWWHISPER === '1')
    app.use(wwwhisper());

  // Prevent people from seeing the manifest.html file.
  // Not that is would be bad if that happened but it's for internal porpouses only.
  app.use('/manifest.html', (req: Request, res: Response) => {
    const exception = new NotFoundException(`Cannot GET ${req.originalUrl}`);
    res.status(exception.getStatus()).send(exception.getResponse());
  });

  // Serve all files from `public` folder.
  app.useStaticAssets(join(__dirname, '..', 'public'), { fallthrough: true });

  // Use pug files from the `views` folder to render views.
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');

  // Setup validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        console.log('==Validation Error==');
        console.error(JSON.stringify(validationErrors));
        return new BadRequestException(validationErrors);
      },
    })
  );

  app.use(morgan('tiny'));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
