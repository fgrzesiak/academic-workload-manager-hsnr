import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import {
  ICreateSupervisionTypeRequest,
  ISupervisionTypeResponse,
  IUpdateSupervisionTypeRequest,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { SupervisionTypeService } from "../services/supervisionType.service";

// controller for managing supervision types
@Controller("supervisionType")
export class SupervisionTypeController {
  // injects the SupervisionTypeService to handle business logic
  constructor(
    private readonly supervisionTypeService: SupervisionTypeService,
  ) {}

  /**
   * endpoint: GET /
   * role: only accessible by users with the CONTROLLER role
   * purpose: retrieves a list of all supervision types
   * returns: an array of ISupervisionTypeResponse objects
   */
  @Get("/")
  @Auth(Role.CONTROLLER)
  async supervisionType(): Promise<ISupervisionTypeResponse[]> {
    return await this.supervisionTypeService.findAll();
  }

  /**
   * endpoint: POST /
   * role: only accessible by users with the CONTROLLER role
   * purpose: creates a new supervision type
   * request body: ICreateSupervisionTypeRequest - contains details of the supervision type to create
   * returns: the created supervision type as an ISupervisionTypeResponse object
   */
  @Post("/")
  @Auth(Role.CONTROLLER)
  async createSupervisionType(
    @Body() supervisionType: ICreateSupervisionTypeRequest,
  ): Promise<ISupervisionTypeResponse> {
    return await this.supervisionTypeService.create(supervisionType);
  }

  /**
   * endpoint: PUT /
   * role: only accessible by users with the CONTROLLER role
   * purpose: updates an existing supervision type
   * request body: IUpdateSupervisionTypeRequest - contains updated details of the supervision type
   * returns: the updated supervision type as an ISupervisionTypeResponse object
   */
  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateSupervisionType(
    @Body() supervisionType: IUpdateSupervisionTypeRequest,
  ): Promise<ISupervisionTypeResponse> {
    return await this.supervisionTypeService.update(supervisionType);
  }
}
