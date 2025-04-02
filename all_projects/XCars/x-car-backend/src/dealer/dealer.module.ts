import { Module } from '@nestjs/common';
import { DealerResolver } from './dealer.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DealerService } from './dealer.service';
import { AWSModule } from 'src/AWS/aws.module';
import { FilterService } from 'src/filter/filter.service';

@Module({
  imports: [PrismaModule, AWSModule],
  providers: [DealerService, DealerResolver, FilterService],
  exports: [DealerService], // Export ViewDealer if needed elsewhere
})
export class DealerModule {}
