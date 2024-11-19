import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { JwtStrategy } from "../../common/strategies/jwt.strategy.js";
import { ConfigModule } from "../config/config.module.js";
import { ConfigKeys, ConfigService } from "../config/config.service.js";
import { UsersController } from "./controllers/users.controller.js";
import { UsersService } from "./services/users.service.js";

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
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
