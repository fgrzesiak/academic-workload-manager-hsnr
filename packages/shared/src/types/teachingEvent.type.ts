import { TeachingEvent as ITeachingEvent } from "@workspace/database";

// utility type that makes all properties optional except for the specified required keys
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

// defines the response type for a TeachingEvent, including only specific properties
export type ITeachingEventResponse = Pick<ITeachingEvent, "id" | "name" | "semesterPeriodId" | "ordered" | "hours" | "programId" | "teacherId" | "commentId">;

// defines the request type for creating a new TeachingEvent
export type ICreateTeachingEventRequest = Pick<
  ITeachingEvent,
  "name" | "semesterPeriodId" | "ordered" | "hours" | "programId" | "teacherId" | "commentId"
>;

// defines the request type for updating a TeachingEvent, with optional properties except for specific required ones
export type IUpdateTeachingEventRequest = OptionalExceptFor<
  Pick<ITeachingEvent, "id" | "name" | "semesterPeriodId" | "ordered" | "hours" | "programId" | "teacherId" | "commentId">,
  "id" | "programId" | "commentId"
>;

export class TeachingEvent implements ITeachingEvent {
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
   * @param data - the raw TeachingEvent data used to initialize the class instance.
   */
  constructor(private data: ITeachingEvent) {
    Object.assign(this, data);
  }

  /**
   * serializes the instance into a plain JSON object.
   * @returns the raw `ITeachingEvent` data, excluding any additional metadata.
   */
  toJSON() {
    const { ...rest } = this.data as ITeachingEvent;
    return rest;
  }

  /**
   * factory method to create a TeachingEvent instance from JSON data.
   * @param data - the serialized `ITeachingEventResponse` object.
   * @returns a new `TeachingEvent` instance initialized with the provided data.
   */
  static fromJSON(data: ITeachingEventResponse) {
    return new TeachingEvent({...data});
  }
}
