import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import {
  ICreateTeachingGroupRequest,
  ITeachingGroupResponse,
  IUpdateTeachingGroupRequest,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { TeachingGroupService } from "../services/teachingGroup.service";

// controller for managing teaching groups
@Controller("teachingGroup")
export class TeachingGroupController {
  // injects the TeachingGroupService to handle business logic
  constructor(private readonly teachingGroupService: TeachingGroupService) {}

  /**
   * endpoint: GET /
   * role: only accessible by users with the CONTROLLER role
   * purpose: retrieves a list of all teaching groups
   * returns: an array of ITeachingGroupResponse objects
   */
  @Get("/")
  @Auth(Role.CONTROLLER)
  async teachingGroup(): Promise<ITeachingGroupResponse[]> {
    return await this.teachingGroupService.findAll();
  }

  /**
   * endpoint: POST /
   * role: only accessible by users with the CONTROLLER role
   * purpose: creates a new teaching group
   * request body: ICreateTeachingGroupRequest - contains details of the teaching group to create
   * returns: the created teaching group as an ITeachingGroupResponse object
   */
  @Post("/")
  @Auth(Role.CONTROLLER)
  async createTeachingGroup(
    @Body() teachingGroup: ICreateTeachingGroupRequest,
  ): Promise<ITeachingGroupResponse> {
    return await this.teachingGroupService.create(teachingGroup);
  }

  /**
   * endpoint: PUT /
   * role: only accessible by users with the CONTROLLER role
   * purpose: updates an existing teaching group
   * request body: IUpdateTeachingGroupRequest - contains updated details of the teaching group
   * returns: the updated teaching group as an ITeachingGroupResponse object
   */
  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateTeachingGroup(
    @Body() teachingGroup: IUpdateTeachingGroupRequest,
  ): Promise<ITeachingGroupResponse> {
    return await this.teachingGroupService.update(teachingGroup);
  }
}
