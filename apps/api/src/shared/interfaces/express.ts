import { Teacher } from "@workspace/repo";
import { Request } from "express";

export interface AuthRequest extends Request {
  teacher: Teacher;
}
