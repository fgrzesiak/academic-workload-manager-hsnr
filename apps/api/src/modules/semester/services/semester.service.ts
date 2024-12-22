import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { semesters } from "@workspace/repo";
import {
  ICreateSemesterRequest,
  IUpdateSemesterRequest,
  ISemesterResponse,
} from "@workspace/shared";

@Injectable()
export class SemesterService {
  constructor(private readonly jwtService: JwtService) {}

  async findAll(): Promise<ISemesterResponse[]> {
    return (await semesters.findAll()).map((semester) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...rest } = semester;
      return rest;
    });
  }

  async create(semester: ICreateSemesterRequest): Promise<ISemesterResponse> {
    const { ...rest } = await semesters.create(semester);
    return rest;
  }

  async update(semester: IUpdateSemesterRequest): Promise<ISemesterResponse> {
    const { ...rest } = await semesters.update(semester);
    return rest;
  }
}
