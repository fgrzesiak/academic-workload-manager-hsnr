import { Supervision as ISupervision } from "@workspace/database";
import { injectable } from "tsyringe";

@injectable()
export class Supervision implements ISupervision {
  id!: number;
  studentId!: number;
  semesterPeriodId!: number;
  supervisionTypeId!: number;
  teacherId!: number;
  commentId!: number;

  constructor(private data: ISupervision) {
    Object.assign(this, data);
  }

  toJSON() {
    return this.data;
  }
}