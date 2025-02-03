import { container } from "tsyringe";

import { ControllerManager } from "./controller.js";
import { TeacherManager } from "./teacher.js";
import { UserManager } from "./user.js";
import { SemesterPeriodManager } from "./semester.js";
import { SupervisionTypeManager } from "./supervisionType.js";
import { SupervisionManager } from "./supervision.js";
import { DiscountTypeManager } from "./discountType.js";
import { DiscountManager } from "./discount.js";
import { TeachingEventManager } from "./teachingEvent.js";
import { TeachingDutyManager } from "./teachingDuty.js";
import { CommentManager } from "./comment.js";
import { EvaluationSettingsManager } from "./evaluationSettings.js";
import { TeachingGroupManager } from "./teachingGroup.js";

export const users = container.resolve(UserManager);
export const controllers = container.resolve(ControllerManager);
export const teachers = container.resolve(TeacherManager);
export const semesters = container.resolve(SemesterPeriodManager);
export const supervisionTypes = container.resolve(SupervisionTypeManager);
export const supervisions = container.resolve(SupervisionManager);
export const discountTypes = container.resolve(DiscountTypeManager);
export const discounts = container.resolve(DiscountManager);
export const teachingEvents = container.resolve(TeachingEventManager);
export const teachingDuties = container.resolve(TeachingDutyManager);
export const comments = container.resolve(CommentManager);
export const evaluationSettings = container.resolve(EvaluationSettingsManager);
export const teachingGroups = container.resolve(TeachingGroupManager);