import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getHealth(): string {
    return 'Health is good';
  }

  async getOtp() {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      return {};
    }
    const prisma = new PrismaClient();

    const otps = await prisma.otpVerification.findMany();
    const data = otps.map((otp) => {
      return { phoneNumber: otp.desc, otp: otp.otp };
    });
    return data;
  }
}
