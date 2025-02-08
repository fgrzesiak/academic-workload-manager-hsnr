import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { evaluationSettings } from "@workspace/repo";
import {
  ICreateEvaluationSettingsRequest,
  IEvaluationSettingsResponse,
  IUpdateEvaluationSettingsRequest,
} from "@workspace/shared";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class EvaluationSettingsService {
  // injects the JwtService for potential token-related operations
  constructor(private readonly jwtService: JwtService) {}

  /**
   * retrieves all evaluation settingss from the repository.
   * @returns a Promise that resolves to an array of evaluation settings responses (IEvaluationSettingsResponse[]).
   */
  async findAll(): Promise<IEvaluationSettingsResponse[]> {
    return (await evaluationSettings.findAll()).map((evaluationSetting) => {
      // removes unnecessary fields from the response before returning
      const { ...rest } = evaluationSetting;
      return rest;
    });
  }

  /**
   * creates a new evaluation settings in the repository.
   * @param evaluationSetting - the details of the evaluation settings to create (ICreateEvaluationSettingsRequest).
   * @returns a Promise that resolves to the created evaluation settings (IEvaluationSettingsResponse).
   */
  async create(
    evaluationSetting: ICreateEvaluationSettingsRequest,
  ): Promise<IEvaluationSettingsResponse> {
    const { ...rest } = await evaluationSettings.create(evaluationSetting);
    return rest;
  }

  /**
   * updates an existing evaluation settings in the repository.
   * @param evaluationSetting - the updated details of the evaluation settings (IUpdateEvaluationSettingsRequest).
   * @returns a Promise that resolves to the updated evaluation settings (IEvaluationSettingsResponse).
   */
  async update(
    evaluationSetting: IUpdateEvaluationSettingsRequest,
  ): Promise<IEvaluationSettingsResponse> {
    const { ...rest } = await evaluationSettings.update(evaluationSetting);
    return rest;
  }
}
