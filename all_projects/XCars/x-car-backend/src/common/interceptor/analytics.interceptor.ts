import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { Observable } from 'rxjs';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Application } from '../enum/application.enum';
import { subMinutes } from 'date-fns';

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const req = ctx.req;
    const authHeader = req.headers['authorization'];
    const ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get user IP
    const userAgent = req.headers['user-agent']; // Get user agent
    const operation = `${info?.parentType?.name} -> ${info.fieldName}`;
    const args = gqlContext.getArgs();

    const token = authHeader ? authHeader.split(' ')[1] : '';

    const acceptEndPoints = ['GetAllCarsUser', 'getCarDetailUser'];
    if (!acceptEndPoints.includes(info.fieldName)) {
      return next.handle();
    }

    let role = null;
    let data = null;
    let currentUserId = null;

    if (token) {
      const decoded = await this.jwtTokenService.verifyAccessToken({ token });

      const user = await this.prismaService.user.findUnique({
        where: {
          id: decoded.sub,
        },
      });

      if (user) {
        role = user.role;
        currentUserId = user.id;
      }

      const admin = await this.prismaService.admin.findUnique({
        where: {
          id: decoded.sub,
        },
      });

      if (admin) {
        role = admin.role;
        currentUserId = admin.id;
      }
    }

    data = {
      ipAddress: String(ipAddress),
      userAgent: String(userAgent),
      operation: String(operation),
      origin: String(req.headers.origin),
      arguments: JSON.stringify(args),
      app: String(req.headers.app),
    };

    if (token && role === Roles.USER && req.headers.app === Application.WEB) {
      data = {
        ...data,
        role,
        ...(role === Roles.ADMIN
          ? { adminId: currentUserId }
          : { userId: currentUserId }),
      };
    }

    if (!role || role === Roles.USER) {
      if (currentUserId) {
        const existingRecord = await this.prismaService.userAnalytics.findFirst(
          {
            where: {
              userId: currentUserId,
              createdAt: {
                gte: subMinutes(new Date(), 1), // Check if createdAt is 1 mins or more before now
              },
            },
          },
        );
        if (!existingRecord) {
          await this.prismaService.userAnalytics.create({
            data: {
              ...data,
              userId: currentUserId,
            },
          });
        }
      } else {
        const existingRecord = await this.prismaService.userAnalytics.findFirst(
          {
            where: {
              ipAddress,
              operation,
              createdAt: {
                gte: subMinutes(new Date(), 1), // Check if createdAt is 1 mins or more before now
              },
            },
          },
        );
        if (!existingRecord) {
          await this.prismaService.userAnalytics.create({
            data,
          });
        }
      }
    }
    return next.handle();
  }
}
