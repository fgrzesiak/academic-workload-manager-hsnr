import { TeachingEvent as ITeachingEvent } from "@workspace/database";
import { ICreateTeachingEventRequest, IUpdateTeachingEventRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { TeachingEvent } from "../structures/index.js";

@singleton()
export class TeachingEventManager {
  constructor(private prisma: PrismaService) {}

  // Find teachingEvent by Id
  async findOne(id: number): Promise<TeachingEvent | null> {
    try {
      const result = await this.prisma.teachingEvent.findUniqueOrThrow({
        where: { id },
      });

      return new TeachingEvent(result);
    } catch (_err) {
      return null;
    }
  }

  // Update teachingEvent details
  async update(teachingEvent: IUpdateTeachingEventRequest): Promise<TeachingEvent> {
    const { id } = teachingEvent;
    const result = await this.prisma.teachingEvent.update({
      data: teachingEvent,
      where: { id },
    });
    return new TeachingEvent(result);
  }

  async findAll(): Promise<ITeachingEvent[]> {
    return await this.prisma.teachingEvent.findMany();
  }

  async create(teachingEvent: ICreateTeachingEventRequest): Promise<TeachingEvent> {
    const result = await this.prisma.teachingEvent.create({ data: teachingEvent });
    return new TeachingEvent(result);
  }
}
