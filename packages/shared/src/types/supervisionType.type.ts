import { SupervisionType as ISupervisionType } from "@workspace/database";

// utility type that makes all properties optional except for the specified required keys
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

// defines the response type for a supervision type, including only specific properties
export type ISupervisionTypeResponse = Pick<
  ISupervisionType,
  "typeOfSupervisionId" | "typeOfSupervision" | "calculationFactor" | "validFrom"
>;

// defines the request type for creating a new supervision type
export type ICreateSupervisionTypeRequest = Pick<
  ISupervisionType,
  "typeOfSupervision" | "calculationFactor" | "validFrom"
>;

// defines the request type for updating an existing supervision type, with optional fields except for the required `typeOfSupervisionId`
export type IUpdateSupervisionTypeRequest = OptionalExceptFor<
  Pick<
    ISupervisionType,
    "typeOfSupervisionId" | "typeOfSupervision" | "calculationFactor" | "validFrom"
  >,
  "typeOfSupervisionId"
>;

// class representing a Supervision Type, including methods for initialization and serialization
export class SupervisionType implements ISupervisionType {
  typeOfSupervisionId!: number; // unique identifier for the supervision type
  typeOfSupervision!: string; // name of the supervision type
  calculationFactor!: number; // factor used for calculation (multiplier: e.g., 0.1, 0.2, ...)
  validFrom!: number; // semesterPeriodId from which this supervision type is valid

  /**
   * constructor for the SupervisionType class.
   * @param data - the raw ISupervisionType data used to initialize the instance.
   */
  constructor(private data: ISupervisionType) {
    Object.assign(this, data); // assign all properties from `data` to the instance
  }

  /**
   * serializes the instance into a plain JSON object.
   * @returns the serialized supervision type data.
   */
  toJSON() {
    const { ...rest } = this.data as ISupervisionType; // include all fields in the serialized object
    return rest; // return the object representation
  }

  /**
   * factory method to create a SupervisionType instance from JSON data.
   * @param data - the serialized `ISupervisionTypeResponse` object.
   * @returns a new `SupervisionType` instance initialized with the provided data.
   */
  static fromJSON(data: ISupervisionTypeResponse) {
    return new SupervisionType(data); // create a new SupervisionType instance
  }
}