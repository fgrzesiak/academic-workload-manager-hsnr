import { DiscountType as IDiscountType } from "@workspace/database";

// utility type that makes all properties optional except for the specified required keys
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

// defines the response type for a discount type, including only specific properties
export type IDiscountTypeResponse = Pick<IDiscountType, "discountTypeId" | "discountType">;

// defines the request type for creating a new discount type
export type ICreateDiscountTypeRequest = Pick<IDiscountType, "discountType">;

// defines the request type for updating an existing discount type, with optional fields except for required ones
export type IUpdateDiscountTypeRequest = OptionalExceptFor<
  Pick<IDiscountType, "discountTypeId" | "discountType">,
  "discountTypeId"
>;

// class representing a discount type, including methods for initialization and serialization
export class DiscountType implements IDiscountType {
  discountTypeId!: number; // unique identifier for the discount type
  discountType!: string; // name of the discount type

  /**
   * constructor for the DiscountType class.
   * @param data - the raw IDiscountType data used to initialize the instance.
   */
  constructor(private data: IDiscountType) {
    Object.assign(this, data); // assign all properties from `data` to the instance
  }

  /**
   * serializes the instance into a plain JSON object.
   * @returns the serialized discount type data.
   */
  toJSON() {
    const { ...rest } = this.data as IDiscountType; // include all fields in the serialized object
    return rest; // return the object representation
  }

  /**
   * factory method to create a DiscountType instance from JSON data.
   * @param data - the serialized `IDiscountTypeResponse` object.
   * @returns a new `DiscountType` instance initialized with the provided data.
   */
  static fromJSON(data: IDiscountTypeResponse) {
    return new DiscountType({ ...data }); // create a new DiscountType instance
  }
}
