import { Controller as IController, User as IUser } from "@workspace/database";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { Controller } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class ControllerManager {
  // constructor initializes the service with PrismaService instance
  constructor(private prisma: PrismaService) {}

  // finds a controller by its ID
  async findOne(id: number): Promise<Controller | null> {
    try {
      // tries to find a unique controller by ID
      const result = await this.prisma.controller.findUniqueOrThrow({
        where: { id },
      });

      return new Controller(result); // returns the found controller as an instance of the Controller class
    } catch (err) {
      return null; // returns null if an error occurs (e.g., controller not found)
    }
  }

  // finds a controller by user ID and includes user data
  async findOneWithUser(userId: number): Promise<Controller | null> {
    try {
      // tries to find a unique controller by user ID
      const result = await this.prisma.controller.findUniqueOrThrow({
        where: { userId },
        include: { user: true }, // includes user details in the result
      });

      return new Controller(result); // returns the found controller as an instance of the Controller class
    } catch (err) {
      return null; // returns null if an error occurs (e.g., controller not found)
    }
  }

  // finds the first controller in the database
  async findFirst(): Promise<Controller | null> {
    try {
      // tries to find the first controller
      const result = await this.prisma.controller.findFirstOrThrow();

      return new Controller(result); // returns the first controller as an instance of the Controller class
    } catch (err) {
      return null; // returns null if an error occurs (e.g., no controllers found)
    }
  }

  // creates a new controller with a related user
  async create(
    controller: Omit<IController, "id" | "userId">,
    user: Omit<IUser, "id" | "createdAt" | "updatedAt">,
  ): Promise<Controller> {
    const result = await this.prisma.controller.create({
      data: { ...controller, user: { create: user } }, // creates a new controller with a new user
    });
    return new Controller(result); // returns the newly created controller as an instance of the Controller class
  }

  // updates an existing controller by ID
  async update(
    id: number,
    data: Partial<Omit<IController, "id" | "userId">>, // accepts partial data excluding id and userId
  ): Promise<void> {
    await this.prisma.controller.update({
      data, // data to update the controller
      where: { id }, // identifies the controller by ID
    });
  }
}
