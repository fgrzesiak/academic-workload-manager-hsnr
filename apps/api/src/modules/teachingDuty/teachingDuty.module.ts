import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { JwtStrategy } from "../../common/strategies/jwt.strategy.js";
import { ConfigModule } from "../config/config.module.js";
import { ConfigKeys, ConfigService } from "../config/config.service.js";
import { TeachingDutyController } from "./controllers/teachingDuty.controller.js";
import { TeachingDutyService } from "./services/teachingDuty.service.js";

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
  providers: [TeachingDutyService, JwtStrategy],
  controllers: [TeachingDutyController],
  exports: [TeachingDutyService],
})
export class TeachingDutyModule {}
