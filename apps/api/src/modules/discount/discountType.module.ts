import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { JwtStrategy } from "../../common/strategies/jwt.strategy.js";
import { ConfigModule } from "../config/config.module.js";
import { ConfigKeys, ConfigService } from "../config/config.service.js";
import { DiscountTypeController } from "./controllers/discountType.controller.js";
import { DiscountTypeService } from "./services/discountType.service.js";

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
  providers: [DiscountTypeService, JwtStrategy],
  controllers: [DiscountTypeController],
  exports: [DiscountTypeService],
})
export class DiscountTypeModule {}
