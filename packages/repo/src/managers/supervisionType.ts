import { SupervisionType as ISupervisionType } from "@workspace/database";
import { ICreateSupervisionTypeRequest, IUpdateSupervisionTypeRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { SupervisionType } from "../structures/index.js";

@singleton()
export class SupervisionTypeManager {
  constructor(private prisma: PrismaService) {}

  // Find supervisionType by typeOfSupervisionId
  async findOne(typeOfSupervisionId: number): Promise<SupervisionType | null> {
    try {
      const result = await this.prisma.supervisionType.findUniqueOrThrow({
        where: { typeOfSupervisionId },
      });

      return new SupervisionType(result);
    } catch (_err) {
      return null;
    }
  }

  // Update supervisionType details
  async update(supervisionType: IUpdateSupervisionTypeRequest): Promise<SupervisionType> {
    const { typeOfSupervisionId } = supervisionType;
    const result = await this.prisma.supervisionType.update({
      data: supervisionType,
      where: { typeOfSupervisionId },
    });
    return new SupervisionType(result);
  }

  async findAll(): Promise<ISupervisionType[]> {
    return await this.prisma.supervisionType.findMany();
  }

  async create(supervisionType: ICreateSupervisionTypeRequest): Promise<SupervisionType> {
    const result = await this.prisma.supervisionType.create({ data: supervisionType });
    return new SupervisionType(result);
  }
}
