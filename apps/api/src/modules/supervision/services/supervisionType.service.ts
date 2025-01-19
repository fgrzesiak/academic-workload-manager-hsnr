import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { supervisionTypes } from "@workspace/repo";
import {
  ICreateSupervisionTypeRequest,
  IUpdateSupervisionTypeRequest,
  ISupervisionTypeResponse,
} from "@workspace/shared";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class SupervisionTypeService {
  // injects the JwtService for potential token-related operations
  constructor(private readonly jwtService: JwtService) {}

  /**
   * retrieves all supervision types from the repository.
   * @returns a Promise that resolves to an array of supervision type responses (ISupervisionTypeResponse[]).
   */
  async findAll(): Promise<ISupervisionTypeResponse[]> {
    return (await supervisionTypes.findAll()).map((supervisionType) => {
      // removes unnecessary fields from the response before returning
      const { ...rest } = supervisionType;
      return rest;
    });
  }

  /**
   * creates a new supervision type in the repository.
   * @param supervisionType - the details of the supervision type to create (ICreateSupervisionTypeRequest).
   * @returns a Promise that resolves to the created supervision type (ISupervisionTypeResponse).
   */
  async create(supervisionType: ICreateSupervisionTypeRequest): Promise<ISupervisionTypeResponse> {
    const { ...rest } = await supervisionTypes.create(supervisionType);
    return rest;
  }

  /**
   * updates an existing supervision type in the repository.
   * @param supervisionType - the updated details of the supervision type (IUpdateSupervisionTypeRequest).
   * @returns a Promise that resolves to the updated supervision type (ISupervisionTypeResponse).
   */
  async update(supervisionType: IUpdateSupervisionTypeRequest): Promise<ISupervisionTypeResponse> {
    const { ...rest } = await supervisionTypes.update(supervisionType);
    return rest;
  }
}
