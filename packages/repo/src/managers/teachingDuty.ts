import { TeachingDutyPerSemester as ITeachingDuty } from "@workspace/database";
import { ICreateTeachingDutyRequest, IUpdateTeachingDutyRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { TeachingDuty } from "../structures/index.js";

@singleton()
export class TeachingDutyManager {
  constructor(private prisma: PrismaService) {}

  // Find teachingDuty by Id
  async findOne(id: number): Promise<TeachingDuty | null> {
    try {
      const result = await this.prisma.teachingDutyPerSemester.findUniqueOrThrow({
        where: { id },
      });

      return new TeachingDuty(result);
    } catch (_err) {
      return null;
    }
  }

  // Update teachingEvent details
  async update(teachingDuty: IUpdateTeachingDutyRequest): Promise<TeachingDuty> {
    const { id } = teachingDuty;
    const result = await this.prisma.teachingDutyPerSemester.update({
      data: teachingDuty,
      where: { id },
    });
    return new TeachingDuty(result);
  }

  async findAll(): Promise<ITeachingDuty[]> {
    return await this.prisma.teachingDutyPerSemester.findMany();
  }

  async create(teachingDuty: ICreateTeachingDutyRequest): Promise<TeachingDuty> {
    const result = await this.prisma.teachingDutyPerSemester.create({ data: teachingDuty });
    return new TeachingDuty(result);
  }

  async delete(id: number) {
    await this.prisma.teachingDutyPerSemester.delete({
      where: { 
        id: id,
      },
    });
  }
}
