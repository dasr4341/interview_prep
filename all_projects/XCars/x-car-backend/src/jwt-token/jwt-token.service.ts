import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ),
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });

    return accessToken;
  }

  async generateRefreshToken(payload) {
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      ),
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    return refreshToken;
  }

  async generateForgetPasswordToken(payload) {
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>(
        'JWT_FORGET_PASSWORD_TOKEN_EXPIRATION_TIME',
      ),
      secret: this.configService.get<string>('JWT_FORGET_PASSWORD_SECRET'),
    });

    return refreshToken;
  }

  async verifyAccessToken({ token }: { token: string }) {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async verifyRefreshToken({ token }: { token: string }) {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  async verifyForgetPasswordToken({ token }: { token: string }) {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_FORGET_PASSWORD_SECRET'),
    });
  }
}
