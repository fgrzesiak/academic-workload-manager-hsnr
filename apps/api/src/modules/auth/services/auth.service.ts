import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User, users } from "@workspace/repo";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any | null> {
    const user = await users.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result; // User data without password
    }
    return null;
  }

  async login(user: { username: string; password: string }) {
    const validUser = await this.validateUser(user.username, user.password);
    if (!validUser) {
      throw new HttpException(
        "Die Anmeldeinformationen sind ungültig.",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = {
      username: validUser.username,
      sub: validUser.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
