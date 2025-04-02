import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from 'src/common/model/response.model';

@ObjectType()
export class RequiredData {
  @Field(() => Boolean, { defaultValue: false })
  isCarProductExist: boolean;

  @Field(() => Boolean, { defaultValue: false })
  isCarImageExist: boolean;

  @Field(() => Boolean, { defaultValue: false })
  isCarVideoExist: boolean;

  @Field(() => Boolean, { defaultValue: false })
  isQuotationExist: boolean;

  @Field(() => Boolean, { defaultValue: false })
  isQuotationPaid: boolean;

  @Field(() => Boolean, { defaultValue: false })
  isThumbnailExist: boolean;
}

@ObjectType()
export class CarApproveStatus {
  @Field(() => RequiredData)
  requiredData: RequiredData;

  @Field(() => Boolean, { defaultValue: false })
  approveStatus: boolean;
}

@ObjectType()
export class GetCarApproveStatus extends Response {
  @Field(() => CarApproveStatus)
  data: CarApproveStatus;
}
