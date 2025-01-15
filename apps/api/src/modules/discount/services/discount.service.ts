import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { discounts } from "@workspace/repo";
import {
  ICreateDiscountRequest,
  IUpdateDiscountRequest,
  IDiscountResponse,
} from "@workspace/shared";

@Injectable()
export class DiscountService {
  constructor(private readonly jwtService: JwtService) {}

  async findAll(): Promise<IDiscountResponse[]> {
    return (await discounts.findAll()).map((discount) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...rest } = discount;
      return rest;
    });
  }

  async create(discount: ICreateDiscountRequest): Promise<IDiscountResponse> {
    const { ...rest } = await discounts.create(discount);
    return rest;
  }

  async update(discount: IUpdateDiscountRequest): Promise<IDiscountResponse> {
    const { ...rest } = await discounts.update(discount);
    return rest;
  }

  async delete(id: number) {
    await discounts.delete(id);
  }
}
