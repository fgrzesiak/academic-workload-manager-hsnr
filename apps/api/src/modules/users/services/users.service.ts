import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User as IUser, users } from "@workspace/repo";
import { IUserResponse } from "@workspace/shared";

@Injectable()
export class UsersService {
  constructor(private readonly jwtService: JwtService) {}

  async findAll(): Promise<IUserResponse[]> {
    return (await users.findAll()).map((user) => {
      const { password, ...rest } = user;
      return rest;
    });
  }
}
