import { TeachingEvent as ITeachingEvent } from "@workspace/database";
import { injectable } from "tsyringe";

@injectable()
export class TeachingEvent implements ITeachingEvent {
  id!: number;
  name!: string;
  semesterPeriodId!: number;
  ordered!: boolean;
  hours!: number;
  programId!: number;
  teacherId!: number;
  commentId!: number;

  constructor(private data: ITeachingEvent) {
    Object.assign(this, data);
  }

  toJSON() {
    return this.data;
  }
}