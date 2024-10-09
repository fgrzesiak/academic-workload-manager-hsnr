import { container } from "tsyringe";

import { TeacherManager } from "./teacher.js";

export const teachers = container.resolve(TeacherManager);
