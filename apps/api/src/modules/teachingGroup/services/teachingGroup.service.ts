import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { teachingGroups } from "@workspace/repo";
import {
  ICreateTeachingGroupRequest,
  ITeachingGroupResponse,
  IUpdateTeachingGroupRequest,
} from "@workspace/shared";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class TeachingGroupService {
  // injects the JwtService for potential token-related operations
  constructor(private readonly jwtService: JwtService) {}

  /**
   * retrieves all teaching groups from the repository.
   * @returns a Promise that resolves to an array of teaching group responses (ITeachingGroupResponse[]).
   */
  async findAll(): Promise<ITeachingGroupResponse[]> {
    return (await teachingGroups.findAll()).map((teachingGroup) => {
      // removes unnecessary fields from the response before returning
      const { ...rest } = teachingGroup;
      return rest;
    });
  }

  /**
   * creates a new teaching group in the repository.
   * @param teachingGroup - the details of the teaching group to create (ICreateTeachingGroupRequest).
   * @returns a Promise that resolves to the created teaching group (ITeachingGroupResponse).
   */
  async create(
    teachingGroup: ICreateTeachingGroupRequest,
  ): Promise<ITeachingGroupResponse> {
    const { ...rest } = await teachingGroups.create(teachingGroup);
    return rest;
  }

  /**
   * updates an existing teaching group in the repository.
   * @param teachingGroup - the updated details of the teaching group (IUpdateTeachingGroupRequest).
   * @returns a Promise that resolves to the updated teaching group (ITeachingGroupResponse).
   */
  async update(
    teachingGroup: IUpdateTeachingGroupRequest,
  ): Promise<ITeachingGroupResponse> {
    const { ...rest } = await teachingGroups.update(teachingGroup);
    return rest;
  }
}
