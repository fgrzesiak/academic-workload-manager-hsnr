import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ICreateUserRequest,
  IUpdateUserRequest,
  IUserResponse,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard";
import { AuthRequest } from "../../../common/interfaces/express";
import { UsersService } from "../services/users.service";

// controller for  managing user-related operations
@Controller("users")
export class UsersController {
  // injects the UsersService to handle business logic
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint: GET /
   * Role: only accessible by users with the CONTROLLER role
   * Purpose: retrieves a list of all users
   * Returns: an array of IUserResponse objects
   */
  @Get("/")
  @Auth(Role.CONTROLLER)
  async users(): Promise<IUserResponse[]> {
    return await this.usersService.findAll();
  }

  /**
   * Endpoint: POST /
   * Role: only accessible by users with the CONTROLLER role
   * Purpose: creates a new user
   * Request Body: ICreateUserRequest - contains details of the user to create
   * Returns: the created user as an IUserResponse object
   */
  @Post("/")
  @Auth(Role.CONTROLLER)
  async createUser(@Body() user: ICreateUserRequest): Promise<IUserResponse> {
    return await this.usersService.create(user);
  }

  /**
   * Endpoint: PUT /
   * Role: only accessible by users with the CONTROLLER role
   * Purpose: updates an existing user
   * Request Body: IUpdateUserRequest - contains updated details of the user
   * Returns: the updated user as an IUserResponse object
   */
  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateUser(@Body() user: IUpdateUserRequest): Promise<IUserResponse> {
    return await this.usersService.update(user);
  }

  /**
   * Endpoint: POST /change-password
   * Role: accessible by any authenticated user
   * Purpose: changes the password for the currently logged-in user
   * Request Body: ChangePasswordRequest - contains the new password
   * Returns: a ChangePasswordResponse object indicating the result of the operation
   */
  @Post("change-password")
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: AuthRequest,
    @Body() data: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    return await this.usersService.changePassword(req.user.id, data.password);
  }
}
