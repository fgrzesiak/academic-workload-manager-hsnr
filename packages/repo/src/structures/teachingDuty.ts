import { TeachingDutyPerSemester as ITeachingDuty } from "@workspace/database";
import { injectable } from "tsyringe";

@injectable()
export class TeachingDuty implements ITeachingDuty {
  id!: number;
  individualDuty!: number;
  sumBalance!: number;
  sumOrderedBalance!: number;
  semesterPeriodId!: number;
  teacherId!: number;

  constructor(private data: ITeachingDuty) {
    Object.assign(this, data);
  }

  toJSON() {
    return this.data;
  }

}
