import { container } from "tsyringe";

import { TeacherManager } from "./teacher.js";
import { UserManager } from "./user.js";

export const teachers = container.resolve(TeacherManager);
export const users = container.resolve(UserManager);
