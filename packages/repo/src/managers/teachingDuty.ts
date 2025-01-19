import { TeachingDutyPerSemester as ITeachingDuty } from "@workspace/database";
import { ICreateTeachingDutyRequest, IUpdateTeachingDutyRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { TeachingDuty } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class TeachingDutyManager {
  constructor(private prisma: PrismaService) {}

  // find teachingDuty by id
  async findOne(id: number): Promise<TeachingDuty | null> {
    try {
      // tries to find a unique teaching duty record by id
      const result = await this.prisma.teachingDutyPerSemester.findUniqueOrThrow({
        where: { id },
      });

      return new TeachingDuty(result); // returns the found teaching duty as an instance of TeachingDuty
    } catch (_err) {
      return null; // returns null if the teaching duty is not found or if an error occurs
    }
  }

  // update teaching duty details
  async update(teachingDuty: IUpdateTeachingDutyRequest): Promise<TeachingDuty> {
    const { id } = teachingDuty;
    // updates the teaching duty record with new data
    const result = await this.prisma.teachingDutyPerSemester.update({
      data: teachingDuty,
      where: { id },
    });
    return new TeachingDuty(result); // returns the updated teaching duty as an instance of TeachingDuty
  }

  // find all teaching duties
  async findAll(): Promise<ITeachingDuty[]> {
    return await this.prisma.teachingDutyPerSemester.findMany(); // returns all teaching duties from the database
  }

  // create a new teaching duty record
  async create(teachingDuty: ICreateTeachingDutyRequest): Promise<TeachingDuty> {
    const result = await this.prisma.teachingDutyPerSemester.create({ data: teachingDuty });
    return new TeachingDuty(result); // returns the created teaching duty as an instance of TeachingDuty
  }

  // delete teaching duty by id
  async delete(id: number) {
    await this.prisma.teachingDutyPerSemester.delete({
      where: {
        id: id, // deletes the teaching duty record by id
      },
    });
  }
}
