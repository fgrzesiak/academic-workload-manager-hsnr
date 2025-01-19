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

// controller for managing teaching duties
@Controller("teachingDuty")
export class TeachingDutyController {
  // injects the TeachingDutyService to handle business logic
  constructor(private readonly teachingDutyService: TeachingDutyService) {}

  /**
   * endpoint: GET /
   * role: only accessible by users with the CONTROLLER role
   * purpose: retrieves a list of all teaching duties
   * returns: an array of ITeachingDutyResponse objects
   */
  @Get("/")
  @Auth(Role.CONTROLLER)
  async teaching(): Promise<ITeachingDutyResponse[]> {
    return await this.teachingDutyService.findAll();
  }

  /**
   * endpoint: POST /
   * role: only accessible by users with the CONTROLLER role
   * purpose: creates a new teaching duty
   * request body: ICreateTeachingDutyRequest - contains details of the teaching duty to create
   * returns: the created teaching duty as an ITeachingDutyResponse object
   */
  @Post("/")
  @Auth(Role.CONTROLLER)
  async createTeachingDuty(@Body() teaching: ICreateTeachingDutyRequest): Promise<ITeachingDutyResponse> {
    return await this.teachingDutyService.create(teaching);
  }

  /**
   * endpoint: PUT /
   * role: only accessible by users with the CONTROLLER role
   * purpose: updates an existing teaching duty
   * request body: IUpdateTeachingDutyRequest - contains updated details of the teaching duty
   * returns: the updated teaching duty as an ITeachingDutyResponse object
   */
  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateTeachingDuty(@Body() teaching: IUpdateTeachingDutyRequest): Promise<ITeachingDutyResponse> {
    return await this.teachingDutyService.update(teaching);
  }

  /**
   * endpoint: DELETE /delete/
   * role: only accessible by users with the CONTROLLER role
   * purpose: deletes a teaching duty by its ID
   * request body: an object containing the ID of the teaching duty to delete
   * returns: the result of the delete operation, as provided by the TeachingDutyService
   */
  @Delete("/delete/")
  @Auth(Role.CONTROLLER)
  async deleteSupervision(@Body() object: { id: number }) {
    const { id } = object;
    return await this.teachingDutyService.delete(id);
  }
}
