import {
  Body,
  Controller,
  Get,
  Post,
  Put,
} from "@nestjs/common";
import {
  ICreateEvaluationSettingsRequest,
  IUpdateEvaluationSettingsRequest,
  IEvaluationSettingsResponse,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { EvaluationSettingsService } from "../services/evaluationSettings.service";

// controller for managing evaluation settingss
@Controller("evaluationSettings")
export class EvaluationSettingsController {
  // injects the EvaluationSettingsService to handle business logic
  constructor(private readonly evaluationSettingsService: EvaluationSettingsService) {}

  /**
   * endpoint: GET /
   * role: only accessible by users with the CONTROLLER role
   * purpose: retrieves a list of all evaluation settingss
   * returns: an array of IEvaluationSettingsResponse objects
   */
  @Get("/")
  @Auth(Role.CONTROLLER)
  async evaluationSettings(): Promise<IEvaluationSettingsResponse[]> {
    return await this.evaluationSettingsService.findAll();
  }

  /**
   * endpoint: POST /
   * role: only accessible by users with the CONTROLLER role
   * purpose: creates a new evaluation settings
   * request body: ICreateEvaluationSettingsRequest - contains details of the evaluation settings to create
   * returns: the created evaluation settings as an IEvaluationSettingsResponse object
   */
  @Post("/")
  @Auth(Role.CONTROLLER)
  async createEvaluationSettings(@Body() evaluationSettings: ICreateEvaluationSettingsRequest): Promise<IEvaluationSettingsResponse> {
    return await this.evaluationSettingsService.create(evaluationSettings);
  }

  /**
   * endpoint: PUT /
   * role: only accessible by users with the CONTROLLER role
   * purpose: updates an existing evaluation settings
   * request body: IUpdateEvaluationSettingsRequest - contains updated details of the evaluation settings
   * returns: the updated evaluation settings as an IEvaluationSettingsResponse object
   */
  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateEvaluationSettings(@Body() evaluationSettings: IUpdateEvaluationSettingsRequest): Promise<IEvaluationSettingsResponse> {
    return await this.evaluationSettingsService.update(evaluationSettings);
  }
}
