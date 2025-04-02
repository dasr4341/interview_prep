import { registerEnumType } from '@nestjs/graphql';

export enum Application {
  WEB = 'WEB',
  APP = 'APP',
}

registerEnumType(Application, { name: 'Application' });
