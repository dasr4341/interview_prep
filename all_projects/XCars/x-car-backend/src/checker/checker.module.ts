import { Global, Module } from '@nestjs/common';
import { CheckerService } from './checker.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [CheckerService],
  exports: [CheckerService],
})
export class CheckerModule {}
