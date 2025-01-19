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

// controller for managing teachers
@Controller("teacher")
export class TeacherController {
  // injects the TeacherService to handle business logic
  constructor(private readonly teacherService: TeacherService) {}

  /**
   * endpoint: GET /
   * role: only accessible by users with the CONTROLLER role
   * purpose: retrieves a list of all teachers
   * returns: an array of ITeacherResponse objects
   */
  @Get("/")
  @Auth(Role.CONTROLLER)
  async teacher(): Promise<ITeacherResponse[]> {
    return await this.teacherService.findAll();
  }

  /**
   * endpoint: POST /
   * role: only accessible by users with the CONTROLLER role
   * purpose: creates a new teacher
   * request body: ICreateTeacherRequest - contains details of the teacher to create
   * returns: the created teacher as an ITeacherResponse object
   */
  // @Post("/")
  // @Auth(Role.CONTROLLER)
  // async createTeacher(@Body() teacher: ICreateTeacherRequest): Promise<ITeacherResponse> {
  //   return await this.teacherService.create(teacher);
  // }

  /**
   * endpoint: PUT /
   * role: only accessible by users with the CONTROLLER role
   * purpose: updates an existing teacher
   * request body: IUpdateTeacherRequest - contains updated details of the teacher
   * returns: the updated teacher as an ITeacherResponse object
   */
  // @Put("/")
  // @Auth(Role.CONTROLLER)
  // async updateTeacher(@Body() teacher: IUpdateTeacherRequest): Promise<ITeacherResponse> {
  //   return await this.teacherService.update(teacher);
  // }
}
