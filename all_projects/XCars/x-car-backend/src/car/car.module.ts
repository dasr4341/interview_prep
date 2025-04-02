import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarResolver } from './car.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AWSModule } from 'src/AWS/aws.module';
import { AWSResolver } from 'src/AWS/aws.resolver';
import { AWSService } from 'src/AWS/aws.service';
import { FilterService } from 'src/filter/filter.service';

@Module({
  imports: [PrismaModule, AWSModule],
  providers: [AWSResolver, AWSService, CarResolver, CarService, FilterService],
  exports: [CarService],
})
export class CarModule {}
