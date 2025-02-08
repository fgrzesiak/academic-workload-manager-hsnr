import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import {
  ICreateDiscountTypeRequest,
  IDiscountTypeResponse,
  IUpdateDiscountTypeRequest,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { DiscountTypeService } from "../services/discountType.service";

// controller for managing discount types
@Controller("discountType")
export class DiscountTypeController {
  // injects the DiscountTypeService to handle business logic
  constructor(private readonly discountTypeService: DiscountTypeService) {}

  /**
   * endpoint: GET /
   * role: only accessible by users with the CONTROLLER role
   * purpose: retrieves a list of all discount types
   * returns: an array of IDiscountTypeResponse objects
   */
  @Get("/")
  @Auth(Role.CONTROLLER)
  async discountType(): Promise<IDiscountTypeResponse[]> {
    return await this.discountTypeService.findAll();
  }

  /**
   * endpoint: POST /
   * role: only accessible by users with the CONTROLLER role
   * purpose: creates a new discount type
   * request body: ICreateDiscountTypeRequest - contains details of the discount type to create
   * returns: the created discount type as an IDiscountTypeResponse object
   */
  @Post("/")
  @Auth(Role.CONTROLLER)
  async createDiscountType(
    @Body() discountType: ICreateDiscountTypeRequest,
  ): Promise<IDiscountTypeResponse> {
    return await this.discountTypeService.create(discountType);
  }

  /**
   * endpoint: PUT /
   * role: only accessible by users with the CONTROLLER role
   * purpose: updates an existing discount type
   * request body: IUpdateDiscountTypeRequest - contains updated details of the discount type
   * returns: the updated discount type as an IDiscountTypeResponse object
   */
  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateDiscountType(
    @Body() discountType: IUpdateDiscountTypeRequest,
  ): Promise<IDiscountTypeResponse> {
    return await this.discountTypeService.update(discountType);
  }
}
