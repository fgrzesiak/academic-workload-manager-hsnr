import { container } from "tsyringe";

import { ControllerManager } from "./controller.js";
import { TeacherManager } from "./teacher.js";
import { UserManager } from "./user.js";

export const users = container.resolve(UserManager);
export const controllers = container.resolve(ControllerManager);
export const teachers = container.resolve(TeacherManager);
