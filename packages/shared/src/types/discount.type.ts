import { Discount as IDiscount } from "@workspace/database";

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

export type IDiscountResponse = Pick<IDiscount, "id" | "discountTypeId" | "semesterPeriodId" | "ordered" | "approvalDate" | "supervisor" | "commentId" | "description" | "scope" | "teacherId">;

export type ICreateDiscountRequest = Pick<
  IDiscount,
  "discountTypeId" | "semesterPeriodId" | "ordered" | "approvalDate" | "supervisor" | "commentId" | "description" | "scope" | "teacherId"
>;

export type IUpdateDiscountRequest = OptionalExceptFor<
  Pick<IDiscount, "id" | "discountTypeId" | "semesterPeriodId" | "ordered" | "approvalDate" | "supervisor" | "commentId" | "description" | "scope" | "teacherId">,
  "id"
>;

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
  teacherId!: number;

  constructor(private data: IDiscount) {
    Object.assign(this, data);
  }

  toJSON() {
    const { ...rest } = this.data as IDiscount;
    return rest;
  }

  static fromJSON(data: IDiscountResponse) {
    return new Discount({...data});
  }
}
