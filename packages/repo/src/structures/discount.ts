import { Discount as IDiscount } from "@workspace/database";
import { injectable } from "tsyringe";

// marks the class as injectable for dependency injection
@injectable()
export class Discount implements IDiscount {
  id!: number; // unique identifier for the discount
  discountTypeId!: number; // ID for the discount type
  semesterPeriodId!: number; // ID for the semester period associated with the discount
  ordered!: boolean; // indicates whether the discount is ordered or not
  approvalDate!: Date; // the date when the discount was approved
  supervisor!: string; // the supervisor who approved the discount
  commentId!: number; // ID for the comment associated with the discount
  description!: string; // a description of the discount
  scope!: number; // the scope of the discount
  teacherId!: number; // the teacher associated with the discount

  // constructor to initialize the discount with data
  constructor(private data: IDiscount) {
    Object.assign(this, data); // assigns the provided data to the class properties
  }

  // method to convert the discount instance to a JSON object
  toJSON() {
    return this.data; // returns the raw data as a plain object
  }
}
