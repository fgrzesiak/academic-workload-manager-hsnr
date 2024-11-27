import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { users } from "@workspace/repo";
import {
  ChangePasswordResponse,
  ICreateUserRequest,
  IUserResponse,
} from "@workspace/shared";
import * as bcrypt from "bcrypt";

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

  async create(user: ICreateUserRequest): Promise<IUserResponse> {
    user.password = await bcrypt.hash(user.password, 10);
    const { password, ...rest } = await users.create(user);
    return rest;
  }

  async changePassword(
    id: number,
    password: string,
  ): Promise<ChangePasswordResponse> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await users.update(id, {
      password: hashedPassword,
      isPasswordTemporary: false,
    });
    return { success: true };
  }
}
