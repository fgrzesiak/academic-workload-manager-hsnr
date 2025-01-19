import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { teachers } from "@workspace/repo";
import { ITeacherResponse } from "@workspace/shared";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class TeacherService {
  // injects the JwtService for potential token-related operations
  constructor(private readonly jwtService: JwtService) {}

  /**
   * retrieves all teachers from the repository.
   * @returns a Promise that resolves to an array of teacher responses (ITeacherResponse[]).
   */
  async findAll(): Promise<ITeacherResponse[]> {
    return (await teachers.findAll()).map((teacher) => {
      // removes unnecessary fields from the response before returning
      const { ...rest } = teacher;
      return rest;
    });
  }

  // /**
  //  * creates a new teacher in the repository.
  //  * @param teacher - the details of the teacher to create (ICreateTeacherRequest).
  //  * @returns a Promise that resolves to the created teacher (ITeacherResponse).
  //  */
  // async create(teacher: ICreateTeacherRequest): Promise<ITeacherResponse> {
  //   const { ...rest } = await teachers.create(teacher);
  //   return rest;
  // }

  // /**
  //  * updates an existing teacher in the repository.
  //  * @param teacher - the updated details of the teacher (IUpdateTeacherRequest).
  //  * @returns a Promise that resolves to the updated teacher (ITeacherResponse).
  //  */
  // async update(teacher: IUpdateTeacherRequest): Promise<ITeacherResponse> {
  //   const { ...rest } = await teachers.update(teacher);
  //   return rest;
  // }
}
