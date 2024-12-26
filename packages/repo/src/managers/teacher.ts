import { Teacher as ITeacher } from "@workspace/database";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { Teacher } from "../structures/index.js";

@singleton()
export class TeacherManager {
  constructor(private prisma: PrismaService) {}

  /**
   * Get by id
   */
  async get(id: number): Promise<Teacher | null> {
    try {
      const result = await this.prisma.teacher.findUniqueOrThrow({
        where: { id },
      });

      return new Teacher(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  /**
   * Get by userId
   */
  async getByUserId(userId: number): Promise<Teacher | null> {
    try {
      const result = await this.prisma.teacher.findUniqueOrThrow({
        where: { userId: userId },
      });

      return new Teacher(result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  /***
   * Get all
   */
  async findAll(): Promise<ITeacher[]> {
    return await this.prisma.teacher.findMany();
  }

  /***
   * Create
   */
  async create(user: Omit<ITeacher, "id" | "createdAt">): Promise<Teacher> {
    const result = await this.prisma.teacher.create({ data: user });
    return new Teacher(result);
  }

  /**
   * Update
   */
  async update(
    id: number,
    data: Partial<Omit<ITeacher, "id" | "createdAt">>,
  ): Promise<void> {
    await this.prisma.teacher.update({
      data,
      where: { id },
    });
  }
}
