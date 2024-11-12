import { User as IUser } from "@workspace/database";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { User } from "../structures/index.js";

@singleton()
export class UserManager {
  constructor(private prisma: PrismaService) {}

  // Find a user by ID, including the Teacher or Controller relation based on the user's role
  async findOne(id: number): Promise<User | null> {
    try {
      const result = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
          Teacher: true, // Include Teacher relation if it exists
          Controller: true, // Include Controller relation if it exists
        },
      });

      return new User(result);
    } catch (_err) {
      return null;
    }
  }

  // Find a user by username, including the Teacher or Controller relation
  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.prisma.user.findUniqueOrThrow({
        where: { username },
        /* include: {
          Teacher: true,
          Controller: true,
        }, */
      });

      return new User(result);
    } catch (_err) {
      return null;
    }
  }

  // Update user details; for Teacher/Controller-specific fields, handle separately in their services if necessary
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
