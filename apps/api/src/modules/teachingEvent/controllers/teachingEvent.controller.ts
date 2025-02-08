import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
import {
  ICreateTeachingEventRequest,
  ITeachingEventResponse,
  IUpdateTeachingEventRequest,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { TeachingEventService } from "../services/teachingEvent.service";

// controller for managing teaching events
@Controller("teachingEvent")
export class TeachingEventController {
  // injects the TeachingEventService to handle business logic
  constructor(private readonly teachingEventService: TeachingEventService) {}

  /**
   * Endpoint: GET /
   * Role: only accessible by users with the CONTROLLER role
   * Purpose: retrieves a list of all teaching events
   * Returns: an array of ITeachingEventResponse objects
   */
  @Get("/")
  @Auth(Role.CONTROLLER)
  async teachingEvent(): Promise<ITeachingEventResponse[]> {
    return await this.teachingEventService.findAll();
  }

  /**
   * Endpoint: POST /
   * Role: only accessible by users with the CONTROLLER role
   * Purpose: creates a new teaching event
   * Request Body: ICreateTeachingEventRequest - contains details of the teaching event to create
   * Returns: the created teaching event as an ITeachingEventResponse object
   */
  @Post("/")
  @Auth(Role.CONTROLLER)
  async createTeachingEvent(
    @Body() teachingEvent: ICreateTeachingEventRequest,
  ): Promise<ITeachingEventResponse> {
    return await this.teachingEventService.create(teachingEvent);
  }

  /**
   * Endpoint: PUT /
   * Role: only accessible by users with the CONTROLLER role
   * Purpose: updates an existing teaching event
   * Request Body: IUpdateTeachingEventRequest - contains updated details of the teaching event
   * Returns: the updated teaching event as an ITeachingEventResponse object
   */
  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateTeachingEvent(
    @Body() teachingEvent: IUpdateTeachingEventRequest,
  ): Promise<ITeachingEventResponse> {
    return await this.teachingEventService.update(teachingEvent);
  }

  /**
   * Endpoint: DELETE /delete/
   * Role: only accessible by users with the CONTROLLER role
   * Purpose: deletes a teaching event by its ID
   * Request Body: an object containing the ID of the teaching event to delete
   * Returns: the result of the delete operation, as provided by the TeachingEventService
   */
  @Delete("/delete/")
  @Auth(Role.CONTROLLER)
  async deleteSupervision(@Body() object: { id: number }) {
    const { id } = object;
    return await this.teachingEventService.delete(id);
  }
}
