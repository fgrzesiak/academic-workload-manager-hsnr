import { TeachingEvent as ITeachingEvent } from "@workspace/database";
import {
  ICreateTeachingEventRequest,
  IUpdateTeachingEventRequest,
} from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { TeachingEvent } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class TeachingEventManager {
  constructor(private prisma: PrismaService) {}

  // find teachingEvent by ID
  async findOne(id: number): Promise<TeachingEvent | null> {
    try {
      const result = await this.prisma.teachingEvent.findUniqueOrThrow({
        where: { id }, // find the teaching event based on its ID
      });

      return new TeachingEvent(result); // wrap the result in a `TeachingEvent` structure
    } catch (_err) {
      return null; // return null if no event is found or an error occurs
    }
  }

  //update teachingEvent
  async update(
    teachingEvent: IUpdateTeachingEventRequest,
  ): Promise<TeachingEvent> {
    const { id } = teachingEvent;
    const result = await this.prisma.teachingEvent.update({
      data: teachingEvent, // update the teaching event with the provided data
      where: { id }, // match the teaching event by its ID
    });
    return new TeachingEvent(result); // wrap the updated event in a `TeachingEvent` structure
  }

  // get all teachingEvents
  async findAll(): Promise<ITeachingEvent[]> {
    return await this.prisma.teachingEvent.findMany(); // retrieve all teaching events
  }

  // Create a new teachingEvent
  async create(
    teachingEvent: ICreateTeachingEventRequest,
  ): Promise<TeachingEvent> {
    const result = await this.prisma.teachingEvent.create({
      data: teachingEvent, // insert the new teaching event into the database
    });
    return new TeachingEvent(result); // wrap the created event in a `TeachingEvent` structure
  }

  // delete teachingEvent by ID
  async delete(id: number) {
    await this.prisma.teachingEvent.delete({
      where: {
        id: id, // delete the teaching event based on its ID
      },
    });
  }
}
