import { SemesterPeriod as ISemesterPeriod } from "@workspace/database";

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

export type ISemesterResponse = Omit<ISemesterPeriod, "active">;

export type ICreateSemesterRequest = Pick<
  ISemesterPeriod,
  "name" | "active"
>;

export type IUpdateSemesterRequest = OptionalExceptFor<
  Pick<ISemesterPeriod, "id" | "name" | "active">,
  "id"
>;

export class SemesterPeriod implements ISemesterPeriod {
  id!: number;
  name!: string;
  active!: boolean;

  constructor(private data: ISemesterPeriod) {
    Object.assign(this, data);
  }

  toJSON() {
    const { ...rest } = this.data as ISemesterPeriod;
    return rest;
  }

  static fromJSON(data: ISemesterResponse) {
    return new SemesterPeriod({
      ...data,
      active: true,
    });
  }
}
