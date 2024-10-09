import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Teacher, teachers } from "@workspace/repo";
import * as bcrypt from "bcrypt";

import { ConfigKeys, ConfigService } from "../../config/config.service.js";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Teacher | null> {
    const user = await teachers.getByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      //const { password, ...result } = user;
      //return result; // User data without password
      return user;
    }
    return null;
  }

  async login(user: { username: string; password: string }) {
    const validUser = await this.validateUser(user.username, user.password);
    if (!validUser) {
      return { message: "Invalid credentials" };
    }
    const payload = { username: validUser.username, sub: validUser.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
