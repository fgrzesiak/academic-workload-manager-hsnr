import { EvaluationSettings as IEvaluationSettings } from "@workspace/database";
import { ICreateEvaluationSettingsRequest, IUpdateEvaluationSettingsRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { EvaluationSettings } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class EvaluationSettingsManager {
  // constructor initializes the service with PrismaService instance
  constructor(private prisma: PrismaService) {}

  // finds evaluationSettings by id
  async findOne(id: number): Promise<EvaluationSettings | null> {
    try {
      // tries to find a unique evaluation setting by its ID
      const result = await this.prisma.evaluationSettings.findUniqueOrThrow({
        where: { id },
      });

      return new EvaluationSettings(result); // returns the found evaluation setting as an instance of EvaluationSettings
    } catch (_err) {
      return null; // returns null if an error occurs (e.g., evaluation setting not found)
    }
  }

  // updates evaluationSettings details
  async update(evaluationSettings: IUpdateEvaluationSettingsRequest): Promise<EvaluationSettings> {
    const { id } = evaluationSettings;
    // updates the evaluation setting in the database using the provided data
    const result = await this.prisma.evaluationSettings.update({
      data: evaluationSettings,
      where: { id },
    });
    return new EvaluationSettings(result); // returns the updated evaluation setting as an instance of EvaluationSettings
  }

  // finds all evaluation settings in the database
  async findAll(): Promise<IEvaluationSettings[]> {
    return await this.prisma.evaluationSettings.findMany(); // returns a list of all evaluation settings
  }

  // creates a new evaluation setting
  async create(evaluationSettings: ICreateEvaluationSettingsRequest): Promise<EvaluationSettings> {
    const result = await this.prisma.evaluationSettings.create({ data: evaluationSettings });
    return new EvaluationSettings(result); // returns the newly created evaluation setting as an instance of EvaluationSettings
  }
}
