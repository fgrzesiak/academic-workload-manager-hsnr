import { EvaluationSettings as IEvaluationSettings } from "@workspace/database";
import { injectable } from "tsyringe";

// marks the class as injectable for dependency injection
@injectable()
export class EvaluationSettings implements IEvaluationSettings {
  id!: number; // unique identifier for the evaluation setting
  key!: string; // name of the evaluation setting
  value!: string; // value of the evaluation setting
  dataType!: string; // data type of the evaluation setting

  // constructor to initialize the supervision type with provided data
  constructor(private data: IEvaluationSettings) {
    Object.assign(this, data); // assigns the provided data to the class properties
  }

  // method to convert the supervision type instance to a JSON object
  toJSON() {
    return this.data; // returns the raw data as a plain object
  }
}
