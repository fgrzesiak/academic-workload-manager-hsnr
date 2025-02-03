import { TeachingGroup as ITeachingGroup } from "@workspace/database";
import { ICreateTeachingGroupRequest, IUpdateTeachingGroupRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { TeachingGroup } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class TeachingGroupManager {
  // constructor initializes the service with PrismaService instance
  constructor(private prisma: PrismaService) {}

  // finds a teaching group by its ID
  async findOne(id: number): Promise<TeachingGroup | null> {
    try {
      // tries to find a unique teaching group by its ID
      const result = await this.prisma.teachingGroup.findUniqueOrThrow({
        where: { id },
      });

      return new TeachingGroup(result); // returns the found teaching group as an instance of the TeachingGroup class
    } catch (_err) {
      return null; // returns null if an error occurs (e.g., teaching group not found)
    }
  }

  // updates teaching group details
  async update(teachingGroup: IUpdateTeachingGroupRequest): Promise<TeachingGroup> {
    const { id } = teachingGroup;
    // updates the teaching group in the database using the provided data
    const result = await this.prisma.teachingGroup.update({
      data: teachingGroup,
      where: { id },
    });
    return new TeachingGroup(result); // returns the updated teaching group as an instance of the TeachingGroup class
  }

  // finds all teaching groups in the database
  async findAll(): Promise<ITeachingGroup[]> {
    return await this.prisma.teachingGroup.findMany(); // returns a list of all teaching groups
  }

  // creates a new teaching group
  async create(teachingGroup: ICreateTeachingGroupRequest): Promise<TeachingGroup> {
    const result = await this.prisma.teachingGroup.create({ data: teachingGroup });
    return new TeachingGroup(result); // returns the newly created teaching group as an instance of the TeachingGroup class
  }
}
