import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { semesters } from "@workspace/repo";
import {
  ICreateSemesterRequest,
  IUpdateSemesterRequest,
  ISemesterResponse,
} from "@workspace/shared";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class SemesterService {
  // injects the JwtService for potential token-related operations
  constructor(private readonly jwtService: JwtService) {}

  /**
   * retrieves all semesters from the repository.
   * @returns a Promise that resolves to an array of semester responses (ISemesterResponse[]).
   */
  async findAll(): Promise<ISemesterResponse[]> {
    return (await semesters.findAll()).map((semester) => {
      // removes unnecessary fields from the response before returning
      const { ...rest } = semester;
      return rest;
    });
  }

  /**
   * creates a new semester in the repository.
   * @param semester - the details of the semester to create (ICreateSemesterRequest).
   * @returns a Promise that resolves to the created semester (ISemesterResponse).
   */
  async create(semester: ICreateSemesterRequest): Promise<ISemesterResponse> {
    const { ...rest } = await semesters.create(semester);
    return rest;
  }

  /**
   * updates an existing semester in the repository.
   * @param semester - the updated details of the semester (IUpdateSemesterRequest).
   * @returns a Promise that resolves to the updated semester (ISemesterResponse).
   */
  async update(semester: IUpdateSemesterRequest): Promise<ISemesterResponse> {
    const { ...rest } = await semesters.update(semester);
    return rest;
  }
}
