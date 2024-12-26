import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { teachers } from "@workspace/repo";
import { ITeacherResponse } from "@workspace/shared";

@Injectable()
export class TeacherService {
  constructor(private readonly jwtService: JwtService) {}

  async findAll(): Promise<ITeacherResponse[]> {
    return (await teachers.findAll()).map((teacher) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...rest } = teacher;
      return rest;
    });
  }

//   async create(teacher: ICreateTeacherRequest): Promise<ITeacherResponse> {
//     const { ...rest } = await teachers.create(teacher);
//     return rest;
//   }

//   async update(teacher: IUpdateTeacherRequest): Promise<ITeacherResponse> {
//     const { ...rest } = await teachers.update(teacher);
//     return rest;
//   }
}
