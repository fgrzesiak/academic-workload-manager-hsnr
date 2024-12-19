import { SemesterPeriod as ISemesterPeriod } from "@workspace/database";
import { ICreateSemesterRequest, IUpdateSemesterRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { SemesterPeriod } from "../structures/index.js";

@singleton()
export class SemesterPeriodManager {
  constructor(private prisma: PrismaService) {}

  // Find semester by ID
  async findOne(id: number): Promise<SemesterPeriod | null> {
    try {
      const result = await this.prisma.semesterPeriod.findUniqueOrThrow({
        where: { id },
      });

      return new SemesterPeriod(result);
    } catch (_err) {
      return null;
    }
  }

  // Update semester details
  async update(semester: IUpdateSemesterRequest): Promise<SemesterPeriod> {
    const { id } = semester;
    const result = await this.prisma.semesterPeriod.update({
      data: semester,
      where: { id },
    });
    return new SemesterPeriod(result);
  }

  async findAll(): Promise<ISemesterPeriod[]> {
    return await this.prisma.semesterPeriod.findMany();
  }

  async create(semester: ICreateSemesterRequest): Promise<SemesterPeriod> {
    const result = await this.prisma.semesterPeriod.create({ data: semester });
    return new SemesterPeriod(result);
  }
}
