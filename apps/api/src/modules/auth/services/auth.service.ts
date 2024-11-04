import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User, users } from "@workspace/repo";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(
    username: string,
    password: string,
    role: User["role"],
  ): Promise<any | null> {
    const user = await users.findByUsername(username);
    if (
      user &&
      user.role === role &&
      (await bcrypt.compare(password, user.password))
    ) {
      const { password, ...result } = user;
      return result; // User data without password
    }
    return null;
  }

  async login(user: {
    username: string;
    password: string;
    role: User["role"];
  }) {
    const validUser = await this.validateUser(
      user.username,
      user.password,
      user.role,
    );
    if (!validUser) {
      return { message: "Ungültige Zugangsdaten" };
    }
    const payload = {
      username: validUser.username,
      sub: validUser.id,
      role: validUser.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
