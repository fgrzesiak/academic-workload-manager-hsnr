import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { JwtStrategy } from "../../common/strategies/jwt.strategy.js";
import { ConfigModule } from "../config/config.module.js";
import { ConfigKeys, ConfigService } from "../config/config.service.js";
import { TeachingEventController } from "./controllers/teachingEvent.controller.js";
import { TeachingEventService } from "./services/teachingEvent.service.js";

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
  providers: [TeachingEventService, JwtStrategy],
  controllers: [TeachingEventController],
  exports: [TeachingEventService],
})
export class TeachingEventModule {}
