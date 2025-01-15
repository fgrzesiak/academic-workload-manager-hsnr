import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
import {
  ICreateSupervisionRequest,
  ISupervisionResponse,
  IUpdateSupervisionRequest,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { SupervisionService } from "../services/supervision.service";

@Controller("supervision")
export class SupervisionController {
  constructor(private readonly supervisionService: SupervisionService) {}

  @Get("/")
  @Auth(Role.CONTROLLER)
  async supervision(): Promise<ISupervisionResponse[]> {
    return await this.supervisionService.findAll();
  }

  @Post("/")
  @Auth(Role.CONTROLLER)
  async createSupervision(
    @Body() supervision: ICreateSupervisionRequest,
  ): Promise<ISupervisionResponse> {
    return await this.supervisionService.create(supervision);
  }

  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateSupervision(
    @Body() supervision: IUpdateSupervisionRequest,
  ): Promise<ISupervisionResponse> {
    return await this.supervisionService.update(supervision);
  }

  @Delete("/delete/")
  @Auth(Role.CONTROLLER)
  async deleteSupervision(@Body() object: { id: number }) {
    const { id } = object;
    return await this.supervisionService.delete(id);
  }
}
