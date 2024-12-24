import {
  Body,
  Controller,
  Get,
  Post,
  Put,
} from "@nestjs/common";
import {
  ICreateDiscountRequest,
  IUpdateDiscountRequest,
  IDiscountResponse,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { DiscountService } from "../services/discount.service";

@Controller("discount")
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get("/")
  @Auth(Role.CONTROLLER)
  async discount(): Promise<IDiscountResponse[]> {
    return await this.discountService.findAll();
  }

  @Post("/")
  @Auth(Role.CONTROLLER)
  async createDiscount(@Body() discount: ICreateDiscountRequest): Promise<IDiscountResponse> {
    return await this.discountService.create(discount);
  }

  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateDiscount(@Body() discount: IUpdateDiscountRequest): Promise<IDiscountResponse> {
    return await this.discountService.update(discount);
  }
}
