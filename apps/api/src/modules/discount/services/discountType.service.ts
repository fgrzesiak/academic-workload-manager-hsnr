import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { discountTypes } from "@workspace/repo";
import {
  ICreateDiscountTypeRequest,
  IUpdateDiscountTypeRequest,
  IDiscountTypeResponse,
} from "@workspace/shared";

@Injectable()
export class DiscountTypeService {
  constructor(private readonly jwtService: JwtService) {}

  async findAll(): Promise<IDiscountTypeResponse[]> {
    return (await discountTypes.findAll()).map((discountType) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...rest } = discountType;
      return rest;
    });
  }

  async create(discountType: ICreateDiscountTypeRequest): Promise<IDiscountTypeResponse> {
    const { ...rest } = await discountTypes.create(discountType);
    return rest;
  }

  async update(discountType: IUpdateDiscountTypeRequest): Promise<IDiscountTypeResponse> {
    const { ...rest } = await discountTypes.update(discountType);
    return rest;
  }
}
