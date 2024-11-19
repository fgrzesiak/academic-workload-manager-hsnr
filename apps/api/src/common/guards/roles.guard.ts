import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";
import { AuthRequest } from "../interfaces/express";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<AuthRequest>();
    return requiredRoles.some((role) => user.role === role);
    //return requiredRoles.some((role) => user.roles?.includes(role));
    //later if permissions are added, we can check if user.permissions includes required permissions
  }
}
