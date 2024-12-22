import { SupervisionType as ISupervisionType } from "@workspace/database";

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

export type ISupervisionTypeResponse = Omit<ISupervisionType, "validFrom">;

export type ICreateSupervisionTypeRequest = Pick<
  ISupervisionType,
  "typeOfSupervision" | "calculationFactor" | "validFrom"
>;

export type IUpdateSupervisionTypeRequest = OptionalExceptFor<
  Pick<ISupervisionType, "typeOfSupervisionId" | "typeOfSupervision" | "calculationFactor" | "validFrom">,
  "typeOfSupervisionId"
>;

export class SupervisionType implements ISupervisionType {
  typeOfSupervisionId!: number;
  typeOfSupervision!: string;
  calculationFactor!: number;
  validFrom!: number;

  constructor(private data: ISupervisionType) {
    Object.assign(this, data);
  }

  toJSON() {
    const { ...rest } = this.data as ISupervisionType;
    return rest;
  }

  static fromJSON(data: ISupervisionTypeResponse) {
    return new SupervisionType({
      ...data,
      validFrom: 0
    });
  }
}
