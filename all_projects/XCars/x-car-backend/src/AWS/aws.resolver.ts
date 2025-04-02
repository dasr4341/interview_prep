import { Resolver } from '@nestjs/graphql';
import { AWSService } from './aws.service';

@Resolver()
export class AWSResolver {
  constructor(private readonly awsService: AWSService) {}
}
