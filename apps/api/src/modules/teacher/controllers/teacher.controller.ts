import {
  Body,
  Controller,
  Get,
  Post,
  Put,
} from "@nestjs/common";
import { ITeacherResponse } from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { TeacherService } from "../services/teacher.service";

@Controller("teacher")
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get("/")
  @Auth(Role.CONTROLLER)
  async teacher(): Promise<ITeacherResponse[]> {
    return await this.teacherService.findAll();
  }

//   @Post("/")
//   @Auth(Role.CONTROLLER)
//   async createTeacher(@Body() teacher: ICreateTeacherRequest): Promise<ITeacherResponse> {
//     return await this.teacherService.create(teacher);
//   }

//   @Put("/")
//   @Auth(Role.CONTROLLER)
//   async updateTeacher(@Body() teacher: IUpdateTeacherRequest): Promise<ITeacherResponse> {
//     return await this.teacherService.update(teacher);
//   }
}
