import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
} from "@nestjs/common";
import {
  ICreateTeachingDutyRequest,
  IUpdateTeachingDutyRequest,
  ITeachingDutyResponse,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { TeachingDutyService } from "../services/teachingDuty.service";

@Controller("teachingDuty")
export class TeachingDutyController {
  constructor(private readonly teachingDutyService: TeachingDutyService) {}

  @Get("/")
  @Auth(Role.CONTROLLER)
  async teaching(): Promise<ITeachingDutyResponse[]> {
    return await this.teachingDutyService.findAll();
  }

  @Post("/")
  @Auth(Role.CONTROLLER)
  async createTeachingDuty(@Body() teaching: ICreateTeachingDutyRequest): Promise<ITeachingDutyResponse> {
    return await this.teachingDutyService.create(teaching);
  }

  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateTeachingDuty(@Body() teaching: IUpdateTeachingDutyRequest): Promise<ITeachingDutyResponse> {
    return await this.teachingDutyService.update(teaching);
  }

  @Delete("/delete/")
  @Auth(Role.CONTROLLER)
  async deleteSupervision(@Body() object: { id: number }) {
    const { id } = object;
    return await this.teachingDutyService.delete(id);
  }
}
