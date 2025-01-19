import { DiscountType as IDiscountType } from "@workspace/database";
import { injectable } from "tsyringe";

// marks the class as injectable for dependency injection
@injectable()
export class DiscountType implements IDiscountType {
  discountTypeId!: number; // unique identifier for the discount type
  discountType!: string; // name of the discount type

  // constructor to initialize the discount type with data
  constructor(private data: IDiscountType) {
    Object.assign(this, data); // assigns the provided data to the class properties
  }

  // method to convert the discount type instance to a JSON object
  toJSON() {
    return this.data; // returns the raw data as a plain object
  }
}
