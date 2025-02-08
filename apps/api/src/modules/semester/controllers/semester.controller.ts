import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import {
  ICreateSemesterRequest,
  ISemesterResponse,
  IUpdateSemesterRequest,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { SemesterService } from "../services/semester.service";

// controller for managing semesters
@Controller("semester")
export class SemesterController {
  // injects the SemesterService to handle business logic
  constructor(private readonly semesterService: SemesterService) {}

  /**
   * endpoint: GET /
   * role: only accessible by users with the CONTROLLER role
   * purpose: retrieves a list of all semesters
   * returns: an array of ISemesterResponse objects
   */
  @Get("/")
  @Auth(Role.CONTROLLER)
  async semester(): Promise<ISemesterResponse[]> {
    return await this.semesterService.findAll();
  }

  /**
   * endpoint: POST /
   * role: only accessible by users with the CONTROLLER role
   * purpose: creates a new semester
   * request body: ICreateSemesterRequest - contains details of the semester to create
   * returns: the created semester as an ISemesterResponse object
   */
  @Post("/")
  @Auth(Role.CONTROLLER)
  async createSemester(
    @Body() semester: ICreateSemesterRequest,
  ): Promise<ISemesterResponse> {
    return await this.semesterService.create(semester);
  }

  /**
   * endpoint: PUT /
   * role: only accessible by users with the CONTROLLER role
   * purpose: updates an existing semester
   * request body: IUpdateSemesterRequest - contains updated details of the semester
   * returns: the updated semester as an ISemesterResponse object
   */
  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateSemester(
    @Body() semester: IUpdateSemesterRequest,
  ): Promise<ISemesterResponse> {
    return await this.semesterService.update(semester);
  }
}
