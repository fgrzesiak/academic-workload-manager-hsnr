import { TeachingDutyPerSemester as ITeachingDuty } from "@workspace/database";

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

export type ITeachingDutyResponse = Pick<ITeachingDuty, "id" | "individualDuty" | "sumBalance" | "sumOrderedBalance" | "semesterPeriodId" | "teacherId">;

export type ICreateTeachingDutyRequest = Pick<
  ITeachingDuty,
  "individualDuty" | "sumBalance" | "sumOrderedBalance" | "semesterPeriodId" | "teacherId"
>;

export type IUpdateTeachingDutyRequest = OptionalExceptFor<
  Pick<ITeachingDuty, "id" | "individualDuty" | "sumBalance" | "sumOrderedBalance" | "semesterPeriodId" | "teacherId">,
  "id"
>;

export class TeachingDuty implements ITeachingDuty {
  id!: number;
  individualDuty!: number;
  sumBalance!: number;
  sumOrderedBalance!: number;
  semesterPeriodId!: number;
  teacherId!: number;

  constructor(private data: ITeachingDuty) {
    Object.assign(this, data);
  }

  toJSON() {
    const { ...rest } = this.data as ITeachingDuty;
    return rest;
  }

  static fromJSON(data: ITeachingDutyResponse) {
    return new TeachingDuty(data);
  }
}
