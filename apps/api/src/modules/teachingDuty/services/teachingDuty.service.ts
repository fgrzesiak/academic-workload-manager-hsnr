import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { teachingDuties } from "@workspace/repo";
import {
  ICreateTeachingDutyRequest,
  IUpdateTeachingDutyRequest,
  ITeachingDutyResponse,
} from "@workspace/shared";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class TeachingDutyService {
  // injects the JwtService for potential token-related operations
  constructor(private readonly jwtService: JwtService) {}

  /**
   * retrieves all teaching duties from the repository.
   * @returns a Promise that resolves to an array of teaching duty responses (ITeachingDutyResponse[]).
   */
  async findAll(): Promise<ITeachingDutyResponse[]> {
    return (await teachingDuties.findAll()).map((teachingDuty) => {
      // removes unnecessary fields from the response before returning
      const { ...rest } = teachingDuty;
      return rest;
    });
  }

  /**
   * creates a new teaching duty in the repository.
   * @param teachingDuty - the details of the teaching duty to create (ICreateTeachingDutyRequest).
   * @returns a Promise that resolves to the created teaching duty (ITeachingDutyResponse).
   */
  async create(teachingDuty: ICreateTeachingDutyRequest): Promise<ITeachingDutyResponse> {
    const { ...rest } = await teachingDuties.create(teachingDuty);
    return rest;
  }

  /**
   * updates an existing teaching duty in the repository.
   * @param teachingDuty - the updated details of the teaching duty (IUpdateTeachingDutyRequest).
   * @returns a Promise that resolves to the updated teaching duty (ITeachingDutyResponse).
   */
  async update(teachingDuty: IUpdateTeachingDutyRequest): Promise<ITeachingDutyResponse> {
    const { ...rest } = await teachingDuties.update(teachingDuty);
    return rest;
  }

  /**
   * deletes a teaching duty from the repository.
   * @param id - the ID of the teaching duty to delete.
   * @returns a Promise that resolves when the deletion is complete.
   */
  async delete(id: number) {
    await teachingDuties.delete(id);
  }
}
