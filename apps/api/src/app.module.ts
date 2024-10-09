import { Module } from "@nestjs/common";

import { AuthModule } from "./modules/auth/auth.module.js";
import { ConfigModule } from "./modules/config/config.module.js";

@Module({
  imports: [AuthModule, ConfigModule],
})
export class AppModule {}
