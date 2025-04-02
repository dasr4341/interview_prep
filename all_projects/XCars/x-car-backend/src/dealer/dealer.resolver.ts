import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from 'src/common/model/user.model';
import { DealerService } from './dealer.service';
import { Roles } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guard/jwt.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { AllowedRoles } from 'src/decorators/allowed-role.decorator';
import { ViewAllDealers } from './model/view-all-dealers.model';
import { PaginationInput } from 'src/common/dto/pagination.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { GetDealerDetails } from './model/dealer-details.model';
import { UserFilterInput, ViewDealer } from './dto/view-dealer.dto';
import { DealerAnalyticsResponse } from './model/dealer-analytics.model';
import CustomError from 'src/global-filters/custom-error-filter';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { DealerAnalyticsDto } from './dto/dealer-analytics.dto';
import { Response } from 'src/common/model/response.model';

@Resolver()
export class DealerResolver {
  constructor(private readonly dealerService: DealerService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => ViewAllDealers)
  viewAllDealers(
    @Args('dealerFilter', { type: () => [UserFilterInput], nullable: true })
    dealerFilter: UserFilterInput[],
    @Args() pagination: PaginationInput,
  ): Promise<ViewAllDealers> {
    return this.dealerService.viewAllDealers(dealerFilter, pagination);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER, Roles.ADMIN)
  @Query(() => GetDealerDetails)
  viewDealer(@Args() args: ViewDealer): Promise<GetDealerDetails> {
    return this.dealerService.viewDealer(args.dealerId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER, Roles.ADMIN)
  @Query(() => DealerAnalyticsResponse)
  getDealerAnalytics(
    @GetUser() user: User,
    @Args('input', { nullable: true, defaultValue: {} })
    input?: DealerAnalyticsDto,
  ) {
    let id = user.id;
    if (user.role === Roles.ADMIN) {
      if (!input.dealerId) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Dealer Id'),
        );
      }
      id = null;
    }
    return this.dealerService.getDealerAnalyticsReport({ id, input });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER)
  @Mutation(() => Response)
  storeDealerAnalyticsData(
    @GetUser() user: User,
    @Args('customerId') customerId: string,
    @Args('dealerLeadId') dealerLeadId: string,
  ) {
    return this.dealerService.storeDealerAnalyticsData({
      customerId,
      dealerLeadId,
      dealerId: user.id,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => Boolean)
  checkDealerApproveStatus(@Args('dealerId') dealerId: string) {
    return this.dealerService.checkDealerApproveStatus({
      dealerId,
    });
  }
}
