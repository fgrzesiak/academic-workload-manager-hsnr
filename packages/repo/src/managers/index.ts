import { container } from "tsyringe";

import { ControllerManager } from "./controller.js";
import { TeacherManager } from "./teacher.js";
import { UserManager } from "./user.js";
import { SemesterPeriodManager } from "./semester.js";
import { SupervisionTypeManager } from "./supervisionType.js";
import { SupervisionManager } from "./supervision.js";
import { DiscountTypeManager } from "./discountType.js";
import { DiscountManager } from "./discount.js";

export const users = container.resolve(UserManager);
export const controllers = container.resolve(ControllerManager);
export const teachers = container.resolve(TeacherManager);
export const semesters = container.resolve(SemesterPeriodManager);
export const supervisionTypes = container.resolve(SupervisionTypeManager);
export const supervisions = container.resolve(SupervisionManager);
export const discountTypes = container.resolve(DiscountTypeManager);
export const discounts = container.resolve(DiscountManager);