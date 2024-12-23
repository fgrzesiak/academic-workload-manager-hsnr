import { Discount as IDiscount } from "@workspace/database";
import { injectable } from "tsyringe";

@injectable()
export class Discount implements IDiscount {
  id!: number;
  discountTypeId!: number;
  semesterPeriodId!: number;
  ordered!: boolean;
  approvalDate!: Date;
  supervisor!: string;
  commentId!: number;
  description!: string;
  scope!: number;

  constructor(private data: IDiscount) {
    Object.assign(this, data);
  }

  toJSON() {
    return this.data;
  }
}