import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { teachingEvents } from "@workspace/repo";
import {
  ICreateTeachingEventRequest,
  IUpdateTeachingEventRequest,
  ITeachingEventResponse,
} from "@workspace/shared";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class TeachingEventService {
  // injects the JwtService for potential token-related operations
  constructor(private readonly jwtService: JwtService) {}

  /**
   * retrieves all teaching events from the repository.
   * @returns a Promise that resolves to an array of teaching event responses (ITeachingEventResponse[]).
   */
  async findAll(): Promise<ITeachingEventResponse[]> {
    return (await teachingEvents.findAll()).map((teachingEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...rest } = teachingEvent;
      return rest;
    });
  }

  /**
   * creates a new teaching event in the repository.
   * @param teachingEvent - the details of the teaching event to create (ICreateTeachingEventRequest).
   * @returns a Promise that resolves to the created teaching event (ITeachingEventResponse).
   */
  async create(teachingEvent: ICreateTeachingEventRequest): Promise<ITeachingEventResponse> {
    const { ...rest } = await teachingEvents.create(teachingEvent);
    return rest;
  }

  /**
   * updates an existing teaching event in the repository.
   * @param teachingEvent - the updated details of the teaching event (IUpdateTeachingEventRequest).
   * @returns a Promise that resolves to the updated teaching event (ITeachingEventResponse).
   */
  async update(teachingEvent: IUpdateTeachingEventRequest): Promise<ITeachingEventResponse> {
    const { ...rest } = await teachingEvents.update(teachingEvent);
    return rest;
  }

  /**
   * deletes a teaching event from the repository.
   * @param id - the ID of the teaching event to delete.
   * @returns a Promise that resolves when the deletion is complete.
   */
  async delete(id: number) {
    await teachingEvents.delete(id);
  }
}
