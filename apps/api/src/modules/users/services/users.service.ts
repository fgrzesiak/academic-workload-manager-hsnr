import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { users } from "@workspace/repo";
import { IUserResponse } from "@workspace/shared";

@Injectable()
export class UsersService {
  constructor(private readonly jwtService: JwtService) {}

  async findAll(): Promise<IUserResponse[]> {
    return (await users.findAll()).map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    });
  }
}
