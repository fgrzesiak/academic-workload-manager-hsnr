import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { JwtStrategy } from "../../common/strategies/jwt.strategy.js";
import { ConfigModule } from "../config/config.module.js";
import { ConfigKeys, ConfigService } from "../config/config.service.js";
import { CommentController } from "./controllers/comment.controller.js";
import { CommentService } from "./services/comment.service.js";

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
  providers: [CommentService, JwtStrategy],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
