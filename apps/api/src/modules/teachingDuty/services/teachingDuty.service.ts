import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { teachingDuties } from "@workspace/repo";
import {
  ICreateTeachingDutyRequest,
  IUpdateTeachingDutyRequest,
  ITeachingDutyResponse,
} from "@workspace/shared";

@Injectable()
export class TeachingDutyService {
  constructor(private readonly jwtService: JwtService) {}

  async findAll(): Promise<ITeachingDutyResponse[]> {
    return (await teachingDuties.findAll()).map((teachingEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...rest } = teachingEvent;
      return rest;
    });
  }

  async create(teachingEvent: ICreateTeachingDutyRequest): Promise<ITeachingDutyResponse> {
    const { ...rest } = await teachingDuties.create(teachingEvent);
    return rest;
  }

  async update(teachingEvent: IUpdateTeachingDutyRequest): Promise<ITeachingDutyResponse> {
    const { ...rest } = await teachingDuties.update(teachingEvent);
    return rest;
  }
}
