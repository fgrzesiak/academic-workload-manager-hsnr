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

import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard.js";
import { AuthRequest } from "../../../common/interfaces/express.js";
import { ConfigService } from "../../config/config.service.js";
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
  ): Promise<{ token: string; role: string }> {
    return await this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Req() req: AuthRequest, @Res() res: Response) {
    return res.json(req.user);
  }
}
