import { DiscountType as IDiscountType } from "@workspace/database";
import { ICreateDiscountTypeRequest, IUpdateDiscountTypeRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { DiscountType } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class DiscountTypeManager {
  // constructor initializes the service with PrismaService instance
  constructor(private prisma: PrismaService) {}

  // finds a discountType by its discountTypeId
  async findOne(discountTypeId: number): Promise<DiscountType | null> {
    try {
      // tries to find a unique discount type by discountTypeId
      const result = await this.prisma.discountType.findUniqueOrThrow({
        where: { discountTypeId },
      });

      return new DiscountType(result); // returns the found discount type as an instance of the DiscountType class
    } catch (_err) {
      return null; // returns null if an error occurs (e.g., discountType not found)
    }
  }

  // updates discountType details
  async update(discountType: IUpdateDiscountTypeRequest): Promise<DiscountType> {
    const { discountTypeId } = discountType;
    // updates the discount type in the database using the provided data
    const result = await this.prisma.discountType.update({
      data: discountType,
      where: { discountTypeId },
    });
    return new DiscountType(result); // returns the updated discount type as an instance of the DiscountType class
  }

  // finds all discount types in the database
  async findAll(): Promise<IDiscountType[]> {
    return await this.prisma.discountType.findMany(); // returns a list of all discount types
  }

  // creates a new discount type
  async create(discountType: ICreateDiscountTypeRequest): Promise<DiscountType> {
    const result = await this.prisma.discountType.create({ data: discountType });
    return new DiscountType(result); // returns the newly created discount type as an instance of the DiscountType class
  }
}
