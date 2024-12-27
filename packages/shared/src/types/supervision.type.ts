import { Supervision as ISupervision } from "@workspace/database";

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

export type ISupervisionResponse = Pick<ISupervision, "id" | "studentId" | "semesterPeriodId" | "supervisionTypeId" | "teacherId" | "commentId">;

export type ICreateSupervisionRequest = Pick<
  ISupervision,
  "studentId" | "semesterPeriodId" | "supervisionTypeId" | "teacherId" | "commentId"
>;

export type IUpdateSupervisionRequest = OptionalExceptFor<
  Pick<ISupervision, "id" | "studentId" | "semesterPeriodId" | "supervisionTypeId" | "teacherId" | "commentId">,
  "id" | "commentId"
>;

export class Supervision implements ISupervision {
  id!: number;
  studentId!: number;
  semesterPeriodId!: number;
  supervisionTypeId!: number;
  teacherId!: number;
  commentId!: number;

  constructor(private data: ISupervision) {
    Object.assign(this, data);
  }

  toJSON() {
    const { ...rest } = this.data as ISupervision;
    return rest;
  }

  static fromJSON(data: ISupervisionResponse) {
    return new Supervision(data);
  }
}
