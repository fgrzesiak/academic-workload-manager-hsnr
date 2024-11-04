import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@workspace/repo";
import { Strategy } from "passport-local";

import { AuthService } from "../services/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
    role: User["role"],
  ): Promise<User> {
    const user = await this.authService.validateUser(username, password, role);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
