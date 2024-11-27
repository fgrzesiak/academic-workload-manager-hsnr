import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ICreateUserRequest,
  IUserResponse,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard";
import { AuthRequest } from "../../../common/interfaces/express";
import { UsersService } from "../services/users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/")
  @Auth(Role.CONTROLLER)
  async users(): Promise<IUserResponse[]> {
    return await this.usersService.findAll();
  }

  @Post("/")
  @Auth(Role.CONTROLLER)
  async createUser(@Body() user: ICreateUserRequest): Promise<IUserResponse> {
    return await this.usersService.create(user);
  }

  @Post("change-password")
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: AuthRequest,
    @Body() data: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    return await this.usersService.changePassword(req.user.id, data.password);
  }
}
