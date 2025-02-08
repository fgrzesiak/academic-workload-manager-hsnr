import { Discount as IDiscount } from "@workspace/database";
import {
  ICreateDiscountRequest,
  IUpdateDiscountRequest,
} from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { Discount } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class DiscountManager {
  // constructor initializes the service with PrismaService instance
  constructor(private prisma: PrismaService) {}

  // finds a discount by its ID
  async findOne(id: number): Promise<Discount | null> {
    try {
      // tries to find a unique discount by ID
      const result = await this.prisma.discount.findUniqueOrThrow({
        where: { id },
      });

      return new Discount(result); // returns the found discount as an instance of the Discount class
    } catch (_err) {
      return null; // returns null if an error occurs (e.g., discount not found)
    }
  }

  // updates discount details
  async update(discount: IUpdateDiscountRequest): Promise<Discount> {
    const { id } = discount;
    // updates the discount in the database using the provided data
    const result = await this.prisma.discount.update({
      data: discount,
      where: { id },
    });
    return new Discount(result); // returns the updated discount as an instance of the Discount class
  }

  // finds all discounts in the database
  async findAll(): Promise<IDiscount[]> {
    return await this.prisma.discount.findMany(); // returns a list of all discounts
  }

  // creates a new discount
  async create(discount: ICreateDiscountRequest): Promise<Discount> {
    const result = await this.prisma.discount.create({ data: discount });
    return new Discount(result); // returns the newly created discount as an instance of the Discount class
  }

  // deletes a discount by its ID
  async delete(id: number): Promise<void> {
    await this.prisma.discount.delete({
      where: {
        id, // identifies the discount by its ID
      },
    });
  }
}
