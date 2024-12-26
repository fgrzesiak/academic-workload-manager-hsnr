import { Teacher as ITeacher } from "@workspace/database";

export type ITeacherResponse = Omit<ITeacher, "accessToken"| "refreshToken" | "createdAt">;

export class Teacher implements ITeacher {
    id!: number;
    userId!: number;
    firstName!: string;
    lastName!: string;
    retirementDate!: Date;
    totalTeachingDuty!: number;
    accessToken!: string;
    refreshToken!: string;
    createdAt!: Date;
  
    constructor(private data: ITeacher) {
      Object.assign(this, data);
    }
}
