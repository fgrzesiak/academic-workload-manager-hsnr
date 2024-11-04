import {
  ArgumentsHost,
  Body,
  Catch,
  Controller,
  ExceptionFilter,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { User } from "@workspace/repo";
import { Response } from "express";

import { AuthRequest } from "../../../shared/interfaces/express.js";
import { ConfigKeys, ConfigService } from "../../config/config.service.js";
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
      role: User["role"];
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
  getProfile(@Request() req) {
    return req.jwt;
  }
}
