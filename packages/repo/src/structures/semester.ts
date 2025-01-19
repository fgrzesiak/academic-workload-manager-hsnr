import { SemesterPeriod as ISemesterPeriod } from "@workspace/database";
import { injectable } from "tsyringe";

// marks the class as injectable for dependency injection
@injectable()
export class SemesterPeriod implements ISemesterPeriod {
  id!: number; // unique identifier for the semester period
  name!: string; // name of the semester period (e.g., "WS23/24")
  active!: boolean; // indicates whether the semester period is active

  // constructor to initialize the semester period with provided data
  constructor(private data: ISemesterPeriod) {
    Object.assign(this, data); // assigns the provided data to the class properties
  }

  // method to convert the semester period instance to a JSON object
  toJSON() {
    return this.data; // returns the raw data as a plain object
  }
}
