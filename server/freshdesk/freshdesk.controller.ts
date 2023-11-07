import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClientId } from 'server/api/api.decorator';
import { ClientGuard } from 'server/guards/client.guard';
import { RolesGuard } from 'server/guards/roles.guard';
import { Roles } from 'server/roles/roles.decorator';
import { FreshdeskService } from './freshdesk.service';

@Controller('freshdesk')
export class FreshdeskController {
  constructor(private readonly freshdeskService: FreshdeskService) {}

  @Get('authenticate')
  authenticate() {
    // TODO
    return this.freshdeskService.authenticate(
      '122c0587-beb7-4e2a-918f-58c6516ad277'
    );
  }

  @Post('request-video')
  @Roles('admin', 'member')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async requestVideo(@ClientId() clientId: string) {
    console.log(clientId);
    await this.freshdeskService.requestVideo(clientId);
  }
}
