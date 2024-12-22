import {
  Body,
  Controller,
  Get,
  Post,
  Put,
} from "@nestjs/common";
import {
  ICreateSupervisionTypeRequest,
  IUpdateSupervisionTypeRequest,
  ISupervisionTypeResponse,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { SupervisionTypeService } from "../services/supervisionType.service";

@Controller("supervisionType")
export class SupervisionTypeController {
  constructor(private readonly supervisionTypeService: SupervisionTypeService) {}

  @Get("/")
  @Auth(Role.CONTROLLER)
  async supervisionType(): Promise<ISupervisionTypeResponse[]> {
    return await this.supervisionTypeService.findAll();
  }

  @Post("/")
  @Auth(Role.CONTROLLER)
  async createSupervisionType(@Body() supervisionType: ICreateSupervisionTypeRequest): Promise<ISupervisionTypeResponse> {
    return await this.supervisionTypeService.create(supervisionType);
  }

  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateSupervisionType(@Body() supervisionType: IUpdateSupervisionTypeRequest): Promise<ISupervisionTypeResponse> {
    return await this.supervisionTypeService.update(supervisionType);
  }
}
