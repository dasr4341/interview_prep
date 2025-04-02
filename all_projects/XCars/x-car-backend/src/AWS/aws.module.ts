import { Global, Module } from '@nestjs/common';
import { AWSService } from './aws.service';
import { HelperModule } from 'src/helper/helper.module';

@Global()
@Module({
  imports: [HelperModule],
  providers: [AWSService],
  exports: [AWSService],
})
export class AWSModule {}
