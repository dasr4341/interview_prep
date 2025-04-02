import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtTokenModule } from 'src/jwt-token/jwt-token.module';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [JwtTokenModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
