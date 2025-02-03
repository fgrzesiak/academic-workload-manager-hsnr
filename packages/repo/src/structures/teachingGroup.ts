import { TeachingGroup as ITeachingGroup } from "@workspace/database";
import { injectable } from "tsyringe";

// marks the class as injectable for dependency injection
@injectable()
export class TeachingGroup implements ITeachingGroup {
  id!: number; // unique identifier for the teaching group
  groupName!: string; // name of the teaching group
  groupDescription!: string | null; // description of the teaching group
  groupBalance!: number; // balance of the teaching group

  // constructor to initialize the semester period with provided data
  constructor(private data: ITeachingGroup) {
    Object.assign(this, data); // assigns the provided data to the class properties
  }

  // method to convert the semester period instance to a JSON object
  toJSON() {
    return this.data; // returns the raw data as a plain object
  }
}
