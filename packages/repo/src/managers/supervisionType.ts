import { SupervisionType as ISupervisionType } from "@workspace/database";
import {
  ICreateSupervisionTypeRequest,
  IUpdateSupervisionTypeRequest,
} from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { SupervisionType } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class SupervisionTypeManager {
  // constructor initializes the service with PrismaService instance
  constructor(private prisma: PrismaService) {}

  // finds supervisionType by typeOfSupervisionId
  async findOne(typeOfSupervisionId: number): Promise<SupervisionType | null> {
    try {
      // tries to find a unique supervision type by its ID
      const result = await this.prisma.supervisionType.findUniqueOrThrow({
        where: { typeOfSupervisionId },
      });

      return new SupervisionType(result); // returns the found supervision type as an instance of SupervisionType
    } catch (_err) {
      return null; // returns null if an error occurs (e.g., supervision type not found)
    }
  }

  // updates supervisionType details
  async update(
    supervisionType: IUpdateSupervisionTypeRequest,
  ): Promise<SupervisionType> {
    const { typeOfSupervisionId } = supervisionType;
    // updates the supervision type in the database using the provided data
    const result = await this.prisma.supervisionType.update({
      data: supervisionType,
      where: { typeOfSupervisionId },
    });
    return new SupervisionType(result); // returns the updated supervision type as an instance of SupervisionType
  }

  // finds all supervision types in the database
  async findAll(): Promise<ISupervisionType[]> {
    return await this.prisma.supervisionType.findMany(); // returns a list of all supervision types
  }

  // creates a new supervision type
  async create(
    supervisionType: ICreateSupervisionTypeRequest,
  ): Promise<SupervisionType> {
    const result = await this.prisma.supervisionType.create({
      data: supervisionType,
    });
    return new SupervisionType(result); // returns the newly created supervision type as an instance of SupervisionType
  }
}
