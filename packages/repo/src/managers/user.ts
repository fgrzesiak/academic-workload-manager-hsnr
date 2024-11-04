import { User as IUser } from "@workspace/database";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { User } from "../structures/index.js";

@singleton()
export class UserManager {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number): Promise<User | null> {
    try {
      const result = await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });

      return new User(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.prisma.user.findUniqueOrThrow({
        where: { username },
      });

      return new User(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  async findFirstController(): Promise<User | null> {
    try {
      const result = await this.prisma.user.findFirstOrThrow({
        where: { role: "CONTROLLER" },
      });

      return new User(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  async create(
    user: Omit<IUser, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    const result = await this.prisma.user.create({ data: user });
    return new User(result);
  }

  async update(
    id: number,
    data: Partial<Omit<IUser, "id" | "createdAt" | "updatedAt">>,
  ): Promise<void> {
    await this.prisma.user.update({
      data,
      where: { id },
    });
  }
}
