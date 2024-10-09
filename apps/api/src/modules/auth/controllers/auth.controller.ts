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
  Req,
  Res,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

import { AuthRequest } from "../../../shared/interfaces/express.js";
import { ConfigKeys, ConfigService } from "../../config/config.service.js";
import { AuthService } from "../services/auth.service.js";

@Catch()
@Injectable()
export class CallbackExceptionFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {
    //
  }

  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    const redirectURL =
      this.configService.get(ConfigKeys.FRONTEND_URL) + "/login";
    response.status(status).redirect(redirectURL);
  }
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto);
  }
}
