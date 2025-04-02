import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Throttle({ default: { limit: 2, ttl: 1000 } })
  @Get('/health')
  health(): string {
    return this.appService.getHealth();
  }

  @Throttle({ default: { limit: 2, ttl: 1000 } })
  @Get('/get-otps')
  async getOtpVerifications() {
    return this.appService.getOtp();
  }
}
