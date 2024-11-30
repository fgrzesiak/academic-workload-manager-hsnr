import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { AuthRequest } from "../interfaces/express";

@Injectable()
export class FirstLoginGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest<AuthRequest>();
    if (user.isPasswordTemporary) {
      throw new Error("Password change required on first login..");
    }

    return true;
  }
}
