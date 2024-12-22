import {
  Body,
  Controller,
  Get,
  Post,
  Put,
} from "@nestjs/common";
import {
  ICreateDiscountTypeRequest,
  IUpdateDiscountTypeRequest,
  IDiscountTypeResponse,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { DiscountTypeService } from "../services/discountType.service";

@Controller("discountType")
export class DiscountTypeController {
  constructor(private readonly discountTypeService: DiscountTypeService) {}

  @Get("/")
  @Auth(Role.CONTROLLER)
  async discountType(): Promise<IDiscountTypeResponse[]> {
    return await this.discountTypeService.findAll();
  }

  @Post("/")
  @Auth(Role.CONTROLLER)
  async createDiscountType(@Body() discountType: ICreateDiscountTypeRequest): Promise<IDiscountTypeResponse> {
    return await this.discountTypeService.create(discountType);
  }

  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateDiscountType(@Body() discountType: IUpdateDiscountTypeRequest): Promise<IDiscountTypeResponse> {
    return await this.discountTypeService.update(discountType);
  }
}
