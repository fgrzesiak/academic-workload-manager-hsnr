import { Supervision as ISupervision } from "@workspace/database";
import { ICreateSupervisionRequest, IUpdateSupervisionRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { Supervision } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class SupervisionManager {
  // constructor initializes the service with PrismaService instance
  constructor(private prisma: PrismaService) {}

  // finds supervision by its ID
  async findOne(id: number): Promise<Supervision | null> {
    try {
      // tries to find a unique supervision by its ID
      const result = await this.prisma.supervision.findUniqueOrThrow({
        where: { id },
      });

      return new Supervision(result); // returns the found supervision as an instance of Supervision
    } catch (_err) {
      return null; // returns null if an error occurs (e.g., supervision not found)
    }
  }

  // updates supervision details
  async update(supervision: IUpdateSupervisionRequest): Promise<Supervision> {
    const { id } = supervision;
    // updates the supervision in the database using the provided data
    const result = await this.prisma.supervision.update({
      data: supervision,
      where: { id },
    });
    return new Supervision(result); // returns the updated supervision as an instance of Supervision
  }

  // finds all supervisions in the database
  async findAll(): Promise<ISupervision[]> {
    return await this.prisma.supervision.findMany(); // returns a list of all supervisions
  }

  // creates a new supervision
  async create(supervision: ICreateSupervisionRequest): Promise<Supervision> {
    const result = await this.prisma.supervision.create({ data: supervision });
    return new Supervision(result); // returns the newly created supervision as an instance of Supervision
  }

  // deletes a supervision by its ID
  async delete(id: number) {
    await this.prisma.supervision.delete({
      where: { id }, // deletes the supervision with the specified ID
    });
  }
}
