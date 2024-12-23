import { Discount as IDiscount } from "@workspace/database";
import { ICreateDiscountRequest, IUpdateDiscountRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { Discount } from "../structures/index.js";

@singleton()
export class DiscountManager {
  constructor(private prisma: PrismaService) {}

  // Find discount by Id
  async findOne(id: number): Promise<Discount | null> {
    try {
      const result = await this.prisma.discount.findUniqueOrThrow({
        where: { id },
      });

      return new Discount(result);
    } catch (_err) {
      return null;
    }
  }

  // Update discount details
  async update(discount: IUpdateDiscountRequest): Promise<Discount> {
    const { id } = discount;
    const result = await this.prisma.discount.update({
      data: discount,
      where: { id },
    });
    return new Discount(result);
  }

  async findAll(): Promise<IDiscount[]> {
    return await this.prisma.discount.findMany();
  }

  async create(discount: ICreateDiscountRequest): Promise<Discount> {
    const result = await this.prisma.discount.create({ data: discount });
    return new Discount(result);
  }
}
