import { TeachingDutyPerSemester as ITeachingDuty } from "@workspace/database";

// utility type that makes all properties optional except for the specified required keys
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

// defines the response type for a Teaching Duty, including only specific properties
export type ITeachingDutyResponse = Pick<
  ITeachingDuty,
  | "id"
  | "individualDuty"
  | "sumBalance"
  | "sumOrderedBalance"
  | "semesterPeriodId"
  | "teacherId"
>;

// defines the request type for creating a new Teaching Duty
export type ICreateTeachingDutyRequest = Pick<
  ITeachingDuty,
  | "individualDuty"
  | "sumBalance"
  | "sumOrderedBalance"
  | "semesterPeriodId"
  | "teacherId"
>;

// defines the request type for updating an existing Teaching Duty, with optional fields except for the required `id`
export type IUpdateTeachingDutyRequest = OptionalExceptFor<
  Pick<
    ITeachingDuty,
    | "id"
    | "individualDuty"
    | "sumBalance"
    | "sumOrderedBalance"
    | "semesterPeriodId"
    | "teacherId"
  >,
  "id"
>;

// class representing a Teaching Duty, including methods for initialization and serialization
export class TeachingDuty implements ITeachingDuty {
  id!: number; // unique identifier for the teaching duty
  individualDuty!: number; // individual teaching duty assigned
  sumBalance!: number; // total balance of the teaching duty
  sumOrderedBalance!: number; // total ordered balance of the teaching duty
  semesterPeriodId!: number; // identifier for the semester period
  teacherId!: number; // identifier for the teacher assigned to the duty

  /**
   * constructor for the TeachingDuty class.
   * @param data - the raw ITeachingDuty data used to initialize the instance.
   */
  constructor(private data: ITeachingDuty) {
    Object.assign(this, data); // assign all properties from `data` to the instance
  }

  /**
   * serializes the instance into a plain JSON object.
   * @returns the serialized teaching duty data.
   */
  toJSON() {
    const { ...rest } = this.data as ITeachingDuty; // include all fields in the serialized object
    return rest; // return the object representation
  }

  /**
   * factory method to create a TeachingDuty instance from JSON data.
   * @param data - the serialized `ITeachingDutyResponse` object.
   * @returns a new `TeachingDuty` instance initialized with the provided data.
   */
  static fromJSON(data: ITeachingDutyResponse) {
    return new TeachingDuty(data); // create a new TeachingDuty instance
  }
}
