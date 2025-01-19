import { Teacher as ITeacher } from "@workspace/database";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { Teacher } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class TeacherManager {
  // constructor initializes the service with PrismaService instance
  constructor(private prisma: PrismaService) {}

  //get teacher by ID
  async get(id: number): Promise<Teacher | null> {
    try {
      // tries to find a unique teacher by their ID
      const result = await this.prisma.teacher.findUniqueOrThrow({
        where: { id },
      });

      return new Teacher(result); // returns the found teacher as an instance of Teacher
    } catch (err) {
      return null; // returns null if an error occurs (e.g., teacher not found)
    }
  }

  //get teacher by userId
  async getByUserId(userId: number): Promise<Teacher | null> {
    try {
      // tries to find a unique teacher by their userId
      const result = await this.prisma.teacher.findUniqueOrThrow({
        where: { userId: userId },
      });

      return new Teacher(result); // returns the found teacher as an instance of Teacher
    } catch (err) {
      return null; // returns null if an error occurs (e.g., teacher not found)
    }
  }

  // get all teachers
  async findAll(): Promise<ITeacher[]> {
    return await this.prisma.teacher.findMany(); // returns a list of all teachers
  }

  //create a new teacher
  async create(user: Omit<ITeacher, "id" | "createdAt">): Promise<Teacher> {
    const result = await this.prisma.teacher.create({ data: user });
    return new Teacher(result); // returns the newly created teacher as an instance of Teacher
  }

  //update a teacher
  async update(id: number, data: Partial<Omit<ITeacher, "id" | "createdAt">>,): Promise<void> {
    await this.prisma.teacher.update({
      data,
      where: { id },
    });
  }
}
