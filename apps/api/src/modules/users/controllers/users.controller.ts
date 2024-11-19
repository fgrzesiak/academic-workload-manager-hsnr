import { Controller, Get } from "@nestjs/common";
import { IUserResponse } from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { UsersService } from "../services/users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/")
  @Auth(Role.CONTROLLER)
  async users(): Promise<IUserResponse[]> {
    return await this.usersService.findAll();
  }
}
