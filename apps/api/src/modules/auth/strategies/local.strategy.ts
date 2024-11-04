import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Teacher } from "@workspace/repo";
import { Strategy } from "passport-local";

import { AuthService } from "../services/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<Teacher> {
    const teacher = await this.authService.validateUser(username, password);
    if (!teacher) {
      throw new UnauthorizedException();
    }
    return teacher;
  }
}
