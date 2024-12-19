import { SemesterPeriod as ISemesterPeriod } from "@workspace/database";
import { injectable } from "tsyringe";

@injectable()
export class SemesterPeriod implements ISemesterPeriod {
  id!: number;
  name!: string;
  active!: boolean;

  constructor(private data: ISemesterPeriod) {
    Object.assign(this, data);
  }

  toJSON() {
    return this.data;
  }
}
