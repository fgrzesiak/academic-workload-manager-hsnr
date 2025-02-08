import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { LoginRequest, LoginResponse } from "@workspace/shared";
import { Response } from "express";

import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard.js";
import { AuthRequest } from "../../../common/interfaces/express.js";
import { ConfigService } from "../../config/config.service.js";
import { AuthService } from "../services/auth.service.js";

// controller for handling authentication-related actions
@Controller("auth")
export class AuthController {
  // injects the AuthService and ConfigService to handle authentication and configuration
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * endpoint: POST /auth/login
   * purpose: authenticates a user and returns a login response with a token
   * request body: LoginRequest - contains username and password for login
   * returns: LoginResponse - contains the JWT token for the authenticated user
   */
  @Post("login")
  async login(@Body() loginDto: LoginRequest): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }

  /**
   * endpoint: GET /auth/profile
   * role: only accessible by authenticated users (JWT required)
   * purpose: retrieves the profile of the authenticated user
   * returns: the user object from the JWT request
   */
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Req() req: AuthRequest, @Res() res: Response) {
    return res.json(req.user);
  }
}
