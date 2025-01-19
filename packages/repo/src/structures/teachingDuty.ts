import { TeachingDutyPerSemester as ITeachingDuty } from "@workspace/database";
import { injectable } from "tsyringe";

// marks the class as injectable for dependency injection
@injectable()
export class TeachingDuty implements ITeachingDuty {
  id!: number; // unique identifier for the teaching duty
  individualDuty!: number; // individual duty assigned to the teacher
  sumBalance!: number; // total balance of the teaching duties
  sumOrderedBalance!: number; // ordered balance of the duties for the semester
  semesterPeriodId!: number; // reference to the semester period associated with the duty
  teacherId!: number; // reference to the teacher's ID

  // constructor to initialize the TeachingDuty instance with provided data
  constructor(private data: ITeachingDuty) {
    Object.assign(this, data); // assigns the provided data to the class properties
  }

  // method to convert the teaching duty instance to a plain JSON object
  toJSON() {
    return this.data; // returns the raw data as a plain object
  }
}
