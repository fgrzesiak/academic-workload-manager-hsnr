import { Controller as IController, User as IUser } from "@workspace/database";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { Controller } from "../structures/index.js";

@singleton()
export class ControllerManager {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number): Promise<Controller | null> {
    try {
      const result = await this.prisma.controller.findUniqueOrThrow({
        where: { id },
      });

      return new Controller(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  async findOneWithUser(userId: number): Promise<Controller | null> {
    try {
      const result = await this.prisma.controller.findUniqueOrThrow({
        where: { userId },
        include: { user: true },
      });

      return new Controller(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  async findFirst(): Promise<Controller | null> {
    try {
      const result = await this.prisma.controller.findFirstOrThrow();

      return new Controller(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  async create(
    controller: Omit<IController, "id" | "userId">,
    user: Omit<IUser, "id" | "createdAt" | "updatedAt">,
  ): Promise<Controller> {
    const result = await this.prisma.controller.create({
      data: { ...controller, user: { create: user } },
    });
    return new Controller(result);
  }

  /**
   * Update
   */
  async update(
    id: number,
    data: Partial<Omit<IController, "id" | "userId">>,
  ): Promise<void> {
    await this.prisma.controller.update({
      data,
      where: { id },
    });
  }
}
