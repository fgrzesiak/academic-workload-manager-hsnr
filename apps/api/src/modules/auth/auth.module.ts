import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { ConfigModule } from "../config/config.module.js";
import { ConfigKeys, ConfigService } from "../config/config.service.js";
import { AuthController } from "./controllers/auth.controller.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";
import { AuthService } from "./services/auth.service.js";
import { JwtStrategy } from "./strategies/jwt.strategy.js";
import { LocalStrategy } from "./strategies/local.strategy.js";

//https://docs.nestjs.com/recipes/passport for authentication
@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(ConfigKeys.JWT_SECRET),
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
