import { DiscountType as IDiscountType } from "@workspace/database";
import { injectable } from "tsyringe";

@injectable()
export class DiscountType implements IDiscountType {
  discountTypeId!: number;
  discountType!: string;

  constructor(private data: IDiscountType) {
    Object.assign(this, data);
  }

  toJSON() {
    return this.data;
  }
}