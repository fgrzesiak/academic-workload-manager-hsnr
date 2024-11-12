import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";

import { AuthRequest } from "../../../shared/interfaces/express.js";
import { ConfigService } from "../../config/config.service.js";
import { JwtAuthGuard } from "../guards/jwt-auth.guard.js";
import { LocalAuthGuard } from "../guards/local-auth.guard.js";
import { AuthService } from "../services/auth.service.js";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post("login")
  async login(
    @Body()
    loginDto: {
      username: string;
      password: string;
    },
  ) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("auth/logout")
  async logout(@Request() req) {
    //TODO: Implement logout
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Req() req: AuthRequest, @Res() res: Response) {
    return res.json(req.user);
  }
}
