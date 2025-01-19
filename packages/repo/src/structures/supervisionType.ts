import { SupervisionType as ISupervisionType } from "@workspace/database";
import { injectable } from "tsyringe";

// marks the class as injectable for dependency injection
@injectable()
export class SupervisionType implements ISupervisionType {
  typeOfSupervisionId!: number; // unique identifier for the type of supervision
  typeOfSupervision!: string; // name of the type of supervision
  calculationFactor!: number; // calculation factor used to determine the supervision's value or weight
  validFrom!: number; // the SemesterPeriodId from which the supervision type is valid

  // constructor to initialize the supervision type with provided data
  constructor(private data: ISupervisionType) {
    Object.assign(this, data); // assigns the provided data to the class properties
  }

  // method to convert the supervision type instance to a JSON object
  toJSON() {
    return this.data; // returns the raw data as a plain object
  }
}
