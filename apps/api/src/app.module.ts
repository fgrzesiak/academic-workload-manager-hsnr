import { Module } from "@nestjs/common";

import { InitControllerService } from "./init.controller.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { ConfigModule } from "./modules/config/config.module.js";
import { UsersModule } from "./modules/users/users.module.js";

@Module({
  imports: [AuthModule, ConfigModule, UsersModule],
  providers: [InitControllerService],
})
export class AppModule {}
