import { Module } from "@nestjs/common";

import { InitControllerService } from "./init.controller.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { ConfigModule } from "./modules/config/config.module.js";
import { UsersModule } from "./modules/users/users.module.js";
import { SemesterModule } from "./modules/semester/semester.module.js";
import { SupervisionTypeModule } from "./modules/supervision/supervisionType.module.js";

@Module({
  imports: [AuthModule, ConfigModule, UsersModule, SemesterModule, SupervisionTypeModule],
  providers: [InitControllerService],
})
export class AppModule {}
