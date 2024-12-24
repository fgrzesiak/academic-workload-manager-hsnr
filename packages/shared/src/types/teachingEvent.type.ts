import { TeachingEvent as ITeachingEvent } from "@workspace/database";

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

export type ITeachingEventResponse = Pick<ITeachingEvent, "id" | "name" | "semesterPeriodId" | "ordered" | "hours" | "programId">;

export type ICreateTeachingEventRequest = Pick<
  ITeachingEvent,
  "name" | "semesterPeriodId" | "ordered" | "hours" | "programId"
>;

export type IUpdateTeachingEventRequest = OptionalExceptFor<
  Pick<ITeachingEvent, "id" | "name" | "semesterPeriodId" | "ordered" | "hours" | "programId">,
  "id" | "programId"
>;

export class TeachingEvent implements ITeachingEvent {
  id!: number;
  name!: string;
  semesterPeriodId!: number;
  ordered!: boolean;
  hours!: number;
  programId!: number;

  constructor(private data: ITeachingEvent) {
    Object.assign(this, data);
  }

  toJSON() {
    const { ...rest } = this.data as ITeachingEvent;
    return rest;
  }

  static fromJSON(data: ITeachingEventResponse) {
    return new TeachingEvent({...data});
  }
}
