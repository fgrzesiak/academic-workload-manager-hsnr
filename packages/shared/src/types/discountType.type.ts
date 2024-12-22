import { DiscountType as IDiscountType } from "@workspace/database";

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

export type IDiscountTypeResponse = Pick<IDiscountType, "discountTypeId" | "discountType">;

export type ICreateDiscountTypeRequest = Pick<
  IDiscountType,
  "discountType"
>;

export type IUpdateDiscountTypeRequest = OptionalExceptFor<
  Pick<IDiscountType, "discountTypeId" | "discountType">,
  "discountTypeId"
>;

export class DiscountType implements IDiscountType {
  discountTypeId!: number;
  discountType!: string;

  constructor(private data: IDiscountType) {
    Object.assign(this, data);
  }

  toJSON() {
    const { ...rest } = this.data as IDiscountType;
    return rest;
  }

  static fromJSON(data: IDiscountTypeResponse) {
    return new DiscountType({...data});
  }
}
