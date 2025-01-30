import { Teacher as ITeacher } from "@workspace/database";

import { IUserResponse } from "./user.type";

// defines the response type for a teacher, excluding sensitive or irrelevant properties
export type ITeacherResponse = ITeacher & {
  user: Pick<IUserResponse, "firstName" | "lastName" | "username">;
};

export type ICreateTeacherRequest = Pick<ITeacher, "retirementDate">;

// class representing a teacher, including methods for initialization and data handling
export class Teacher implements ITeacher {
  id!: number; // unique identifier for the teacher
  userId!: number; // associated user id
  firstName!: string; // first name of the teacher
  lastName!: string; // last name of the teacher
  retirementDate!: Date; // retirement date of the teacher
  totalTeachingDuty!: number; // total teaching duty assigned to the teacher
  accessToken!: string; // access token for authentication (excluded in responses)
  refreshToken!: string; // refresh token for authentication (excluded in responses)
  createdAt!: Date; // date when the teacher record was created

  /**
   * constructor for the Teacher class.
   * @param data - the raw ITeacher data used to initialize the instance.
   */
  constructor(private data: ITeacher) {
    Object.assign(this, data); // assign all properties from `data` to the instance
  }
}
