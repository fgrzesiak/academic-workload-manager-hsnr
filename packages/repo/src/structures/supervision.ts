import { Supervision as ISupervision } from "@workspace/database";
import { injectable } from "tsyringe";

// marks the class as injectable for dependency injection
@injectable()
export class Supervision implements ISupervision {
  id!: number; // unique identifier for the supervision
  studentId!: number; // ID of the student being supervised
  semesterPeriodId!: number; // ID of the semester period in which the supervision takes place
  supervisionTypeId!: number; // ID of the type of supervision
  teacherId!: number; // ID of the teacher supervising the student
  commentId!: number; // ID of the comment related to this supervision
  supervisionShare!: number | null; //share for praxis supervision

  // constructor to initialize the supervision with provided data
  constructor(private data: ISupervision) {
    Object.assign(this, data); // assigns the provided data to the class properties
  }

  // method to convert the supervision instance to a JSON object
  toJSON() {
    return this.data; // returns the raw data as a plain object
  }
}
