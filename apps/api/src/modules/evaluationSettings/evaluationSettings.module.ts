import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { JwtStrategy } from "../../common/strategies/jwt.strategy.js";
import { ConfigModule } from "../config/config.module.js";
import { ConfigKeys, ConfigService } from "../config/config.service.js";
import { EvaluationSettingsController } from "./controllers/evaluationSettings.controller.js";
import { EvaluationSettingsService } from "./services/evaluationSettings.service.js";

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
  providers: [EvaluationSettingsService, JwtStrategy],
  controllers: [EvaluationSettingsController],
  exports: [EvaluationSettingsService],
})
export class EvaluationSettingsModule {}
