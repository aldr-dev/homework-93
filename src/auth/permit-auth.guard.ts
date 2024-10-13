import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermitAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string>('roles', context.getHandler());

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    return roles.includes(user.role);
  }
}
