import { Controller, Get } from '@nestjs/common';
import { Public } from './infra/http/modules/auth/decorators/isPublic';

@Controller('/')
export class AppController {
  @Get()
  @Public()
  async appGet() {
    return;
  }
}
