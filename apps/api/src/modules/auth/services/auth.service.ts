import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User, users } from "@workspace/repo";
import { LoginRequest, LoginResponse } from "@workspace/shared";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await users.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: LoginRequest): Promise<LoginResponse> {
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
      token: this.jwtService.sign(payload),
      role: validUser.role,
      isPasswordTemporary: validUser.isPasswordTemporary,
    };
  }
}
