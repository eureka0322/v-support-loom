import { Global, Module } from '@nestjs/common';

import { ConfigService } from './config.service';
import { RootPathProvider } from './rootPath.provider';

@Global()
@Module({
  providers: [ConfigService, RootPathProvider],
  exports: [ConfigService, RootPathProvider],
})
export class ConfigModule {}
