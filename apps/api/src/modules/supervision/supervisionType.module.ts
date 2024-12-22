import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { JwtStrategy } from "../../common/strategies/jwt.strategy.js";
import { ConfigModule } from "../config/config.module.js";
import { ConfigKeys, ConfigService } from "../config/config.service.js";
import { SupervisionTypeController } from "./controllers/supervisionType.controller.js";
import { SupervisionTypeService } from "./services/supervisionType.service.js";

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(ConfigKeys.JWT_SECRET),
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  providers: [SupervisionTypeService, JwtStrategy],
  controllers: [SupervisionTypeController],
  exports: [SupervisionTypeService],
})
export class SupervisionTypeModule {}
