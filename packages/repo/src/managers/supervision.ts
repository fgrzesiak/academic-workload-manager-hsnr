import { Supervision as ISupervision } from "@workspace/database";
import { ICreateSupervisionRequest, IUpdateSupervisionRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { Supervision } from "../structures/index.js";

@singleton()
export class SupervisionManager {
  constructor(private prisma: PrismaService) {}

  // Find supervision by Id
  async findOne(id: number): Promise<Supervision | null> {
    try {
      const result = await this.prisma.supervision.findUniqueOrThrow({
        where: { id },
      });

      return new Supervision(result);
    } catch (_err) {
      return null;
    }
  }

  // Update supervision details
  async update(supervision: IUpdateSupervisionRequest): Promise<Supervision> {
    const { id } = supervision;
    const result = await this.prisma.supervision.update({
      data: supervision,
      where: { id },
    });
    return new Supervision(result);
  }

  async findAll(): Promise<ISupervision[]> {
    return await this.prisma.supervision.findMany();
  }

  async create(supervision: ICreateSupervisionRequest): Promise<Supervision> {
    const result = await this.prisma.supervision.create({ data: supervision });
    return new Supervision(result);
  }

  async delete(id: number) {
    await this.prisma.supervision.delete({
      where: { 
        id: id,
      },
    });
  }
}
