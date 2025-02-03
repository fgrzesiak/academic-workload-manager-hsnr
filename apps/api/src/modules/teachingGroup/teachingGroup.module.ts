import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { JwtStrategy } from "../../common/strategies/jwt.strategy.js";
import { ConfigModule } from "../config/config.module.js";
import { ConfigKeys, ConfigService } from "../config/config.service.js";
import { TeachingGroupController } from "./controllers/teachingGroup.controller.js";
import { TeachingGroupService } from "./services/teachingGroup.service.js";

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
  providers: [TeachingGroupService, JwtStrategy],
  controllers: [TeachingGroupController],
  exports: [TeachingGroupService],
})
export class TeachingGroupModule {}
