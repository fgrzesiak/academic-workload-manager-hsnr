import { DiscountType as IDiscountType } from "@workspace/database";
import { ICreateDiscountTypeRequest, IUpdateDiscountTypeRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { DiscountType } from "../structures/index.js";

@singleton()
export class DiscountTypeManager {
  constructor(private prisma: PrismaService) {}

  // Find discountType by discountTypeId
  async findOne(discountTypeId: number): Promise<DiscountType | null> {
    try {
      const result = await this.prisma.discountType.findUniqueOrThrow({
        where: { discountTypeId },
      });

      return new DiscountType(result);
    } catch (_err) {
      return null;
    }
  }

  // Update discountType details
  async update(discountType: IUpdateDiscountTypeRequest): Promise<DiscountType> {
    const { discountTypeId } = discountType;
    const result = await this.prisma.discountType.update({
      data: discountType,
      where: { discountTypeId },
    });
    return new DiscountType(result);
  }

  async findAll(): Promise<IDiscountType[]> {
    return await this.prisma.discountType.findMany();
  }

  async create(discountType: ICreateDiscountTypeRequest): Promise<DiscountType> {
    const result = await this.prisma.discountType.create({ data: discountType });
    return new DiscountType(result);
  }
}
