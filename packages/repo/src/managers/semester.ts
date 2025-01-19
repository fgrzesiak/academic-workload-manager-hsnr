import { SemesterPeriod as ISemesterPeriod } from "@workspace/database";
import { ICreateSemesterRequest, IUpdateSemesterRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { SemesterPeriod } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class SemesterPeriodManager {
  // constructor initializes the service with PrismaService instance
  constructor(private prisma: PrismaService) {}

  // finds a semester by its ID
  async findOne(id: number): Promise<SemesterPeriod | null> {
    try {
      // tries to find a unique semester by its ID
      const result = await this.prisma.semesterPeriod.findUniqueOrThrow({
        where: { id },
      });

      return new SemesterPeriod(result); // returns the found semester as an instance of the SemesterPeriod class
    } catch (_err) {
      return null; // returns null if an error occurs (e.g., semester not found)
    }
  }

  // updates semester details
  async update(semester: IUpdateSemesterRequest): Promise<SemesterPeriod> {
    const { id } = semester;
    // updates the semester in the database using the provided data
    const result = await this.prisma.semesterPeriod.update({
      data: semester,
      where: { id },
    });
    return new SemesterPeriod(result); // returns the updated semester as an instance of the SemesterPeriod class
  }

  // finds all semesters in the database
  async findAll(): Promise<ISemesterPeriod[]> {
    return await this.prisma.semesterPeriod.findMany(); // returns a list of all semesters
  }

  // creates a new semester
  async create(semester: ICreateSemesterRequest): Promise<SemesterPeriod> {
    const result = await this.prisma.semesterPeriod.create({ data: semester });
    return new SemesterPeriod(result); // returns the newly created semester as an instance of the SemesterPeriod class
  }
}
