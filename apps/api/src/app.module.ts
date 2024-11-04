import { Module } from "@nestjs/common";

import { InitControllerService } from "./init.controller.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { ConfigModule } from "./modules/config/config.module.js";

@Module({
  imports: [AuthModule, ConfigModule],
  providers: [InitControllerService],
})
export class AppModule {}
