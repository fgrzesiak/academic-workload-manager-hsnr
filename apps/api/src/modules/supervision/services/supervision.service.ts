import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { supervisions } from "@workspace/repo";
import {
  ICreateSupervisionRequest,
  IUpdateSupervisionRequest,
  ISupervisionResponse,
} from "@workspace/shared";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class SupervisionService {
  // injects the JwtService for potential token-related operations
  constructor(private readonly jwtService: JwtService) {}

  /**
   * retrieves all supervisions from the repository.
   * @returns a Promise that resolves to an array of supervision responses (ISupervisionResponse[]).
   */
  async findAll(): Promise<ISupervisionResponse[]> {
    return (await supervisions.findAll()).map((supervision) => {
      // removes unnecessary fields from the response before returning
      const { ...rest } = supervision;
      return rest;
    });
  }

  /**
   * creates a new supervision in the repository.
   * @param supervision - the details of the supervision to create (ICreateSupervisionRequest).
   * @returns a Promise that resolves to the created supervision (ISupervisionResponse).
   */
  async create(supervision: ICreateSupervisionRequest): Promise<ISupervisionResponse> {
    const { ...rest } = await supervisions.create(supervision);
    return rest;
  }

  /**
   * updates an existing supervision in the repository.
   * @param supervision - the updated details of the supervision (IUpdateSupervisionRequest).
   * @returns a Promise that resolves to the updated supervision (ISupervisionResponse).
   */
  async update(supervision: IUpdateSupervisionRequest): Promise<ISupervisionResponse> {
    const { ...rest } = await supervisions.update(supervision);
    return rest;
  }

  /**
   * deletes a supervision from the repository.
   * @param id - the ID of the supervision to delete.
   * @returns a Promise that resolves when the deletion is complete.
   */
  async delete(id: number) {
    await supervisions.delete(id);
  }
}
