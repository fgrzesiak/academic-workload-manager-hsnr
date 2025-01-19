import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { ROLES_KEY } from "../decorators/roles.decorator"; // imports the key used in the roles decorator to store roles metadata
import { Role } from "../enums/role.enum"; // imports the Role enum that defines the possible user roles
import { AuthRequest } from "../interfaces/express"; // imports the interface for the AuthRequest, which includes user info

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // reflector is used to get metadata set in the route handler

  /**
   * checks if the user has the required roles to access the route.
   * the roles are retrieved from the metadata set using the roles decorator.
   * @param context - contains information about the request and the route handler.
   * @returns true if the user has at least one of the required roles, false otherwise.
   */
  canActivate(context: ExecutionContext): boolean {
    // retrieves the roles required for the route from the metadata
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // retrieves the user from the request object
    const { user } = context.switchToHttp().getRequest<AuthRequest>();

    // checks if the user has any of the required roles
    return requiredRoles.some((role) => user.role === role);
    // for future enhancements, we can check if the user has any required permissions as well
    // return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
