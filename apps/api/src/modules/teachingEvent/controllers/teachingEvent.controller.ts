import {
  Body,
  Controller,
  Get,
  Post,
  Put,
} from "@nestjs/common";
import {
  ICreateTeachingEventRequest,
  IUpdateTeachingEventRequest,
  ITeachingEventResponse,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { TeachingEventService } from "../services/teachingEvent.service";

@Controller("teachingEvent")
export class TeachingEventController {
  constructor(private readonly teachingEventService: TeachingEventService) {}

  @Get("/")
  @Auth(Role.CONTROLLER)
  async teachingEvent(): Promise<ITeachingEventResponse[]> {
    return await this.teachingEventService.findAll();
  }

  @Post("/")
  @Auth(Role.CONTROLLER)
  async createTeachingEvent(@Body() teachingEvent: ICreateTeachingEventRequest): Promise<ITeachingEventResponse> {
    return await this.teachingEventService.create(teachingEvent);
  }

  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateTeachingEvent(@Body() teachingEvent: IUpdateTeachingEventRequest): Promise<ITeachingEventResponse> {
    return await this.teachingEventService.update(teachingEvent);
  }
}
