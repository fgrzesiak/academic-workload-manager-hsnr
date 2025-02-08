import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
import {
  ICreateDiscountRequest,
  IDiscountResponse,
  IUpdateDiscountRequest,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { DiscountService } from "../services/discount.service";

// controller for managing discounts
@Controller("discount")
export class DiscountController {
  // injects the DiscountService to handle business logic
  constructor(private readonly discountService: DiscountService) {}

  /**
   * endpoint: GET /
   * role: only accessible by users with the CONTROLLER role
   * purpose: retrieves a list of all discounts
   * returns: an array of IDiscountResponse objects
   */
  @Get("/")
  @Auth(Role.CONTROLLER)
  async discount(): Promise<IDiscountResponse[]> {
    return await this.discountService.findAll();
  }

  /**
   * endpoint: POST /
   * role: only accessible by users with the CONTROLLER role
   * purpose: creates a new discount
   * request body: ICreateDiscountRequest - contains details of the discount to create
   * returns: the created discount as an IDiscountResponse object
   */
  @Post("/")
  @Auth(Role.CONTROLLER)
  async createDiscount(
    @Body() discount: ICreateDiscountRequest,
  ): Promise<IDiscountResponse> {
    return await this.discountService.create(discount);
  }

  /**
   * endpoint: PUT /
   * role: only accessible by users with the CONTROLLER role
   * purpose: updates an existing discount
   * request body: IUpdateDiscountRequest - contains updated details of the discount
   * returns: the updated discount as an IDiscountResponse object
   */
  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateDiscount(
    @Body() discount: IUpdateDiscountRequest,
  ): Promise<IDiscountResponse> {
    return await this.discountService.update(discount);
  }

  /**
   * endpoint: DELETE /delete/
   * role: only accessible by users with the CONTROLLER role
   * purpose: deletes a discount by its ID
   * request body: an object containing the ID of the discount to delete
   * returns: the result of the delete operation, as provided by the DiscountService
   */
  @Delete("/delete/")
  @Auth(Role.CONTROLLER)
  async deleteSupervision(@Body() object: { id: number }) {
    const { id } = object;
    return await this.discountService.delete(id);
  }
}
