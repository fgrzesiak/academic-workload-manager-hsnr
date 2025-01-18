import { TeachingEvent as ITeachingEvent } from "@workspace/database";
import { ICreateTeachingEventRequest, IUpdateTeachingEventRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { TeachingEvent } from "../structures/index.js";

@singleton()
export class TeachingEventManager {
  constructor(private prisma: PrismaService) {}

  /**
   * finds a teaching event by its ID.
   * @param id - the ID of the teaching event to find.
   * @returns a `TeachingEvent` object or `null` if no event is found.
   */
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

  /**
   * updates the details of a teaching event.
   * @param teachingEvent - an object containing the updated teaching event data.
   * @returns the updated `TeachingEvent` object.
   */
  async update(teachingEvent: IUpdateTeachingEventRequest): Promise<TeachingEvent> {
    const { id } = teachingEvent;
    const result = await this.prisma.teachingEvent.update({
      data: teachingEvent, // update the teaching event with the provided data
      where: { id }, // match the teaching event by its ID
    });
    return new TeachingEvent(result); // wrap the updated event in a `TeachingEvent` structure
  }

  /**
   * retrieves all teaching events from the database.
   * @returns a list of teaching events as raw database objects.
   */
  async findAll(): Promise<ITeachingEvent[]> {
    return await this.prisma.teachingEvent.findMany();  // retrieve all teaching events
  }

  /**
   * creates a new teaching event.
   * @param teachingEvent - the data for the new teaching event.
   * @returns the newly created `TeachingEvent` object.
   */
  async create(teachingEvent: ICreateTeachingEventRequest): Promise<TeachingEvent> {
    const result = await this.prisma.teachingEvent.create({ 
      data: teachingEvent, // insert the new teaching event into the database
    });
    return new TeachingEvent(result); // wrap the created event in a `TeachingEvent` structure
  }

  /**
   * deletes a teaching event by its ID.
   * @param id - the ID of the teaching event to delete.
   */
  async delete(id: number) {
    await this.prisma.teachingEvent.delete({
      where: { 
        id: id, // delete the teaching event based on its ID
      },
    });
  }
}
