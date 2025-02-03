import { Supervision as ISupervision } from "@workspace/database";

// utility type that makes all properties optional except for the specified required keys
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

// defines the response type for a supervision, including only specific properties
export type ISupervisionResponse = Pick<
  ISupervision,
  "id" | "studentId" | "semesterPeriodId" | "supervisionTypeId" | "teacherId" | "commentId" | "supervisionShare"
>;

// defines the request type for creating a new supervision
export type ICreateSupervisionRequest = Pick<
  ISupervision,
  "studentId" | "semesterPeriodId" | "supervisionTypeId" | "teacherId" | "commentId" | "supervisionShare"
>;

// defines the request type for updating an existing supervision, with optional fields except for required ones
export type IUpdateSupervisionRequest = OptionalExceptFor<
  Pick<
    ISupervision,
    "id" | "studentId" | "semesterPeriodId" | "supervisionTypeId" | "teacherId" | "commentId" | "supervisionShare"
  >,
  "id" | "commentId" | "supervisionShare"
>;

// class representing a supervision, including methods for initialization and serialization
export class Supervision implements ISupervision {
  id!: number; // unique identifier for the supervision
  studentId!: number; // identifier for the associated student
  semesterPeriodId!: number; // identifier for the semester period
  supervisionTypeId!: number; // identifier for the type of supervision
  teacherId!: number; // identifier for the supervising teacher
  commentId!: number; // identifier for the associated comment
  supervisionShare!: number | null; //share for praxis supervision

  /**
   * constructor for the Supervision class.
   * @param data - the raw ISupervision data used to initialize the instance.
   */
  constructor(private data: ISupervision) {
    Object.assign(this, data); // assign all properties from `data` to the instance
  }

  /**
   * serializes the instance into a plain JSON object.
   * @returns the serialized supervision data.
   */
  toJSON() {
    const { ...rest } = this.data as ISupervision; // include all fields in the serialized object
    return rest; // return the object representation
  }

  /**
   * factory method to create a Supervision instance from JSON data.
   * @param data - the serialized `ISupervisionResponse` object.
   * @returns a new `Supervision` instance initialized with the provided data.
   */
  static fromJSON(data: ISupervisionResponse) {
    return new Supervision(data); // create a new Supervision instance
  }
}
