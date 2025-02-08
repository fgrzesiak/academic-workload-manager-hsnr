import { SemesterPeriod as ISemesterPeriod } from "@workspace/database";

// utility type that makes all properties optional except for the specified required keys
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

// defines the response type for a semester, including only specific properties
export type ISemesterResponse = Pick<ISemesterPeriod, "id" | "name" | "active">;

// defines the request type for creating a new semester
export type ICreateSemesterRequest = Pick<ISemesterPeriod, "name" | "active">;

// defines the request type for updating an existing semester, with optional fields except for required ones
export type IUpdateSemesterRequest = OptionalExceptFor<
  Pick<ISemesterPeriod, "id" | "name" | "active">,
  "id"
>;

// class representing a semester period, including methods for initialization and serialization
export class SemesterPeriod implements ISemesterPeriod {
  id!: number; // unique identifier for the semester period
  name!: string; // name of the semester period
  active!: boolean; // indicates whether the semester is currently active

  /**
   * constructor for the SemesterPeriod class.
   * @param data - the raw ISemesterPeriod data used to initialize the instance.
   */
  constructor(private data: ISemesterPeriod) {
    Object.assign(this, data); // assign all properties from `data` to the instance
  }

  /**
   * serializes the instance into a plain JSON object.
   * @returns the serialized semester period data.
   */
  toJSON() {
    const { ...rest } = this.data as ISemesterPeriod; // include all fields in the serialized object
    return rest; // return the object representation
  }

  /**
   * factory method to create a SemesterPeriod instance from JSON data.
   * @param data - the serialized `ISemesterResponse` object.
   * @returns a new `SemesterPeriod` instance initialized with the provided data.
   */
  static fromJSON(data: ISemesterResponse) {
    return new SemesterPeriod({ ...data }); // create a new SemesterPeriod instance
  }
}
