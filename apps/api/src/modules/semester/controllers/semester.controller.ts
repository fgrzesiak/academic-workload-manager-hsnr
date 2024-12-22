import {
  Body,
  Controller,
  Get,
  Post,
  Put,
} from "@nestjs/common";
import {
  ICreateSemesterRequest,
  IUpdateSemesterRequest,
  ISemesterResponse,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { SemesterService } from "../services/semester.service";

@Controller("semester")
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Get("/")
  @Auth(Role.CONTROLLER)
  async semester(): Promise<ISemesterResponse[]> {
    return await this.semesterService.findAll();
  }

  @Post("/")
  @Auth(Role.CONTROLLER)
  async createSemester(@Body() semester: ICreateSemesterRequest): Promise<ISemesterResponse> {
    return await this.semesterService.create(semester);
  }

  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateSemester(@Body() semester: IUpdateSemesterRequest): Promise<ISemesterResponse> {
    return await this.semesterService.update(semester);
  }
}
