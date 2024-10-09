import { Teacher as ITeacher } from "@workspace/database";
import { injectable } from "tsyringe";

import { teachers } from "../managers/index.js";

@injectable()
export class Teacher implements ITeacher {
  id!: number;
  username!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  retirementDate!: Date;
  totalTeachingDuty!: number;
  accessToken!: string;
  refreshToken!: string;
  createdAt!: Date;

  constructor(private data: ITeacher) {
    Object.assign(this, data);
  }

  toJSON() {
    return this.data;
  }

  /**
   * Update user
   */
  async update(data: Partial<Omit<ITeacher, "id" | "createdAt">>) {
    Object.assign(this, data);
    await teachers.update(this.id, data);
  }
}
