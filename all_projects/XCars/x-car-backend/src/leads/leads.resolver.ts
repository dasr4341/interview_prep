import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LeadsService } from './leads.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guard/jwt.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from '@prisma/client';
import { AllowedRoles } from 'src/decorators/allowed-role.decorator';
import { LeadModel, UnassignedLeadModel } from './model/get-leads.model';
import { PaginationInput } from 'src/common/dto/pagination.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/common/model/user.model';
import { DealerLeadsResponse } from './model/dealer-leads.model';
import { Response } from 'src/common/model/response.model';
import { GetAdminLeads } from './dto/get-admin-leads.dto';
import { GetDealerLeads } from './dto/get-dealer-leads.dto';

@Resolver()
export class LeadsResolver {
  constructor(private leadsService: LeadsService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => LeadModel)
  async getAdminLeads(
    @Args() pagination: PaginationInput,
    @Args() input: GetAdminLeads,
  ) {
    return this.leadsService.getAdminLeads({
      leadId: input.leadId,
      pagination,
      filter: input.filter,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER)
  @Query(() => DealerLeadsResponse)
  async getDealerLeads(
    @GetUser() user: User,
    @Args() pagination: PaginationInput,
    @Args() input: GetDealerLeads,
  ): Promise<DealerLeadsResponse> {
    return await this.leadsService.getDealerLeads({
      dealerId: user.id,
      leadId: input.leadId,
      pagination,
      filter: input.filter,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => UnassignedLeadModel)
  async assignLeadsToDealer(
    @Args('leads', { type: () => [String] }) leads: string[],
  ) {
    return await this.leadsService.assignLeads({ leads });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER)
  @Mutation(() => Response)
  async updateDealerNote(
    @GetUser() user: User,
    @Args('leadId') leadId: string,
    @Args('note') note: string,
  ) {
    return await this.leadsService.updateNote({
      dealerId: user.id,
      leadId,
      note,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER)
  @Mutation(() => Response)
  async updateLeadSeenStatus(
    @GetUser() user: User,
    @Args('isSeenAll', {
      type: () => Boolean,
      defaultValue: false,
      nullable: true,
    })
    isSeenAll?: boolean,
    @Args('leadIds', { type: () => [String], nullable: true })
    leadIds?: string[],
  ) {
    return await this.leadsService.updateLeadSeenStatus({
      dealerId: user.id,
      isSeenAll,
      leadIds,
    });
  }
}
