import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { teachingEvents } from "@workspace/repo";
import {
  ICreateTeachingEventRequest,
  IUpdateTeachingEventRequest,
  ITeachingEventResponse,
} from "@workspace/shared";

@Injectable()
export class TeachingEventService {
  constructor(private readonly jwtService: JwtService) {}

  async findAll(): Promise<ITeachingEventResponse[]> {
    return (await teachingEvents.findAll()).map((teachingEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...rest } = teachingEvent;
      return rest;
    });
  }

  async create(teachingEvent: ICreateTeachingEventRequest): Promise<ITeachingEventResponse> {
    const { ...rest } = await teachingEvents.create(teachingEvent);
    return rest;
  }

  async update(teachingEvent: IUpdateTeachingEventRequest): Promise<ITeachingEventResponse> {
    const { ...rest } = await teachingEvents.update(teachingEvent);
    return rest;
  }
}
