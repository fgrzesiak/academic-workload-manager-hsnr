import { Teacher as ITeacher } from "@workspace/database";
import { injectable } from "tsyringe";

import { teachers } from "../managers/index.js";

// marks the class as injectable for dependency injection
@injectable()
export class Teacher implements ITeacher {
  id!: number; // unique identifier for the teacher
  userId!: number; // reference to the user's id in the system
  firstName!: string; // teacher's first name
  lastName!: string; // teacher's last name
  retirementDate!: Date; // date when the teacher retired
  totalTeachingDuty!: number; // total number of teaching hours assigned
  accessToken!: string; // access token used for authentication
  refreshToken!: string; // refresh token used to get a new access token
  createdAt!: Date; // date when the teacher record was created
  teachingGroupId!: number; // associated teaching group id

  // constructor to initialize the teacher instance with provided data
  constructor(private data: ITeacher) {
    Object.assign(this, data); // assigns the provided data to the class properties
  }

  // method to convert the teacher instance to a plain JSON object
  toJSON() {
    return this.data; // returns the raw data as a plain object
  }

  /**
   * update user information (excluding id and createdAt)
   * @param data - partial data to update the teacher information
   */
  async update(data: Partial<Omit<ITeacher, "id" | "createdAt">>) {
    Object.assign(this, data); // assigns the provided update data to the teacher instance
    await teachers.update(this.id, data); // calls the manager method to persist the changes
  }
}
