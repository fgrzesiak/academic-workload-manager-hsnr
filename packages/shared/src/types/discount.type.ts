import { Discount as IDiscount } from "@workspace/database";

// utility type that makes all properties optional except for the specified required keys
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

// defines the response type for a discount, including only specific properties
export type IDiscountResponse = Pick<
  IDiscount,
  | "id"
  | "discountTypeId"
  | "semesterPeriodId"
  | "ordered"
  | "approvalDate"
  | "supervisor"
  | "commentId"
  | "description"
  | "scope"
  | "teacherId"
>;

// defines the request type for creating a new discount
export type ICreateDiscountRequest = Pick<
  IDiscount,
  | "discountTypeId"
  | "semesterPeriodId"
  | "ordered"
  | "approvalDate"
  | "supervisor"
  | "commentId"
  | "description"
  | "scope"
  | "teacherId"
>;

// defines the request type for updating an existing discount, with optional fields except for required ones
export type IUpdateDiscountRequest = OptionalExceptFor<
  Pick<
    IDiscount,
    | "id"
    | "discountTypeId"
    | "semesterPeriodId"
    | "ordered"
    | "approvalDate"
    | "supervisor"
    | "commentId"
    | "description"
    | "scope"
    | "teacherId"
  >,
  "id" | "commentId"
>;

// class representing a discount, including methods for initialization and serialization
export class Discount implements IDiscount {
  id!: number; // unique identifier for the discount
  discountTypeId!: number; // identifier for the associated discount type
  semesterPeriodId!: number; // identifier for the related semester period
  ordered!: boolean; // indicates if the discount is ordered
  approvalDate!: Date; // date when the discount was approved
  supervisor!: string; // supervisor associated with the discount
  commentId!: number; // identifier for the associated comment
  description!: string; // description of the discount
  scope!: number; // scope of the discount
  teacherId!: number; // identifier for the associated teacher

  /**
   * constructor for the Discount class.
   * @param data - the raw IDiscount data used to initialize the instance.
   */
  constructor(private data: IDiscount) {
    Object.assign(this, data); // assign all properties from `data` to the instance
  }

  /**
   * serializes the instance into a plain JSON object.
   * @returns the serialized discount data.
   */
  toJSON() {
    const { ...rest } = this.data as IDiscount; // include all fields in the serialized object
    return rest; // return the object representation
  }

  /**
   * factory method to create a Discount instance from JSON data.
   * @param data - the serialized `IDiscountResponse` object.
   * @returns a new `Discount` instance initialized with the provided data.
   */
  static fromJSON(data: IDiscountResponse) {
    return new Discount({ ...data }); // create a new Discount instance
  }
}
