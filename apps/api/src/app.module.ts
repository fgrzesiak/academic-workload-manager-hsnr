import { Module } from "@nestjs/common";

import { InitControllerService } from "./init.controller.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { ConfigModule } from "./modules/config/config.module.js";
import { UsersModule } from "./modules/users/users.module.js";
import { SemesterModule } from "./modules/semester/semester.module.js";

@Module({
  imports: [AuthModule, ConfigModule, UsersModule, SemesterModule],
  providers: [InitControllerService],
})
export class AppModule {}
