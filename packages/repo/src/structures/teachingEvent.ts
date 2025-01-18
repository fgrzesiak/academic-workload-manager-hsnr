import { TeachingEvent as ITeachingEvent } from "@workspace/database";
import { injectable } from "tsyringe";

@injectable()
export class TeachingEvent implements ITeachingEvent {
  // properties of the TeachingEvent class
  id!: number; // unique identifier for the teaching event
  name!: string; // name of the teaching event
  semesterPeriodId!: number; // ID of the associated semester period
  ordered!: boolean; // indicates if the teaching event is ordered
  hours!: number; // number of hours associated with the teaching event
  programId!: number; // ID of the related program
  teacherId!: number; // ID of the assigned teacher
  commentId!: number; // ID of the related comment

  /**
   * constructor for the TeachingEvent class.
   * @param data - the data used to initialize the teaching event.
   * the `data` parameter is of type `ITeachingEvent`, representing the raw teaching event data.
   */
  constructor(private data: ITeachingEvent) {
    Object.assign(this, data); // assign all properties from `data` to the class instance
  }

  /**
   * converts the teaching event instance into a plain JSON object.
   * @returns the raw `ITeachingEvent` data.
   */
  toJSON() {
    return this.data; // return the original raw data
  }
}