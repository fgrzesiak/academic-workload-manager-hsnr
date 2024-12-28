import { Module } from "@nestjs/common";

import { InitControllerService } from "./init.controller.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { ConfigModule } from "./modules/config/config.module.js";
import { UsersModule } from "./modules/users/users.module.js";
import { SemesterModule } from "./modules/semester/semester.module.js";
import { SupervisionTypeModule } from "./modules/supervision/supervisionType.module.js";
import { SupervisionModule } from "./modules/supervision/supervision.module.js";
import { DiscountTypeModule } from "./modules/discount/discountType.module.js";
import { DiscountModule } from "./modules/discount/discount.module.js";
import { TeachingEventModule } from "./modules/teachingEvent/teachingEvent.module.js";
import { TeacherModule } from "./modules/teacher/teacher.module.js";
import { TeachingDutyModule } from "./modules/teachingDuty/teachingDuty.module.js";
import { CommentModule } from "./modules/comment/comment.module.js";

@Module({
  imports: [AuthModule, ConfigModule, UsersModule, SemesterModule, SupervisionTypeModule, SupervisionModule, DiscountTypeModule, DiscountModule, TeachingEventModule, TeacherModule, TeachingDutyModule, CommentModule],
  providers: [InitControllerService],
})
export class AppModule {}
