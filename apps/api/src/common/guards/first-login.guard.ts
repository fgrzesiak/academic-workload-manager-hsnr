import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { AuthRequest } from "../interfaces/express";

// imports the AuthRequest interface for type-checking the request

@Injectable()
export class FirstLoginGuard implements CanActivate {
  /**
   * checks if the user is allowed to access the route.
   * this guard ensures that users who have a temporary password are redirected to change it.
   * @param context - contains information about the request and route.
   * @returns true if the user can access the route, false otherwise.
   * @throws Error if the user's password is temporary and needs to be changed.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // retrieves the user object from the HTTP request
    const { user } = context.switchToHttp().getRequest<AuthRequest>();

    // checks if the user's password is temporary
    if (user.isPasswordTemporary) {
      // throws an error indicating that the password must be changed on first login
      throw new Error("Password change required on first login..");
    }

    // returns true, allowing access if the password is not temporary
    return true;
  }
}
