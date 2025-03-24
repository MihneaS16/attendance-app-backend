import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../users/enums/role.enum';
import { Roles } from '../decorators/roles.decorator';
import { Request } from 'express';
import { User } from 'src/app/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: Omit<User, 'password'> }>();

    if (!request.user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (!this.matchRoles(roles, request.user.role)) {
      throw new UnauthorizedException('You are not allowed to do this');
    }
    return true;
  }

  private matchRoles(roles: Role[], role: Role) {
    if (roles.includes(role)) {
      return true;
    }
    return false;
  }
}
