import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
import {
  ICreateSupervisionRequest,
  ISupervisionResponse,
  IUpdateSupervisionRequest,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { SupervisionService } from "../services/supervision.service";

// controller for managing supervisions
@Controller("supervision")
export class SupervisionController {
  // injects the SupervisionService to handle business logic
  constructor(private readonly supervisionService: SupervisionService) {}

  /**
   * endpoint: GET /
   * role: only accessible by users with the CONTROLLER role
   * purpose: retrieves a list of all supervisions
   * returns: an array of ISupervisionResponse objects
   */
  @Get("/")
  @Auth(Role.CONTROLLER)
  async supervision(): Promise<ISupervisionResponse[]> {
    return await this.supervisionService.findAll();
  }

  /**
   * endpoint: POST /
   * role: only accessible by users with the CONTROLLER role
   * purpose: creates a new supervision
   * request body: ICreateSupervisionRequest - contains details of the supervision to create
   * returns: the created supervision as an ISupervisionResponse object
   */
  @Post("/")
  @Auth(Role.CONTROLLER)
  async createSupervision(
    @Body() supervision: ICreateSupervisionRequest,
  ): Promise<ISupervisionResponse> {
    return await this.supervisionService.create(supervision);
  }

  /**
   * endpoint: PUT /
   * role: only accessible by users with the CONTROLLER role
   * purpose: updates an existing supervision
   * request body: IUpdateSupervisionRequest - contains updated details of the supervision
   * returns: the updated supervision as an ISupervisionResponse object
   */
  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateSupervision(
    @Body() supervision: IUpdateSupervisionRequest,
  ): Promise<ISupervisionResponse> {
    return await this.supervisionService.update(supervision);
  }

  /**
   * endpoint: DELETE /delete/
   * role: only accessible by users with the CONTROLLER role
   * purpose: deletes a supervision by its ID
   * request body: an object containing the ID of the supervision to delete
   * returns: the result of the delete operation, as provided by the SupervisionService
   */
  @Delete("/delete/")
  @Auth(Role.CONTROLLER)
  async deleteSupervision(@Body() object: { id: number }) {
    const { id } = object;
    return await this.supervisionService.delete(id);
  }
}
