import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { discountTypes } from "@workspace/repo";
import {
  ICreateDiscountTypeRequest,
  IDiscountTypeResponse,
  IUpdateDiscountTypeRequest,
} from "@workspace/shared";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class DiscountTypeService {
  // injects the JwtService for potential token-related operations
  constructor(private readonly jwtService: JwtService) {}

  /**
   * retrieves all discount types from the repository.
   * @returns a Promise that resolves to an array of discount type responses (IDiscountTypeResponse[]).
   */
  async findAll(): Promise<IDiscountTypeResponse[]> {
    return (await discountTypes.findAll()).map((discountType) => {
      // removes unnecessary fields from the response before returning
      const { ...rest } = discountType;
      return rest;
    });
  }

  /**
   * creates a new discount type in the repository.
   * @param discountType - the details of the discount type to create (ICreateDiscountTypeRequest).
   * @returns a Promise that resolves to the created discount type (IDiscountTypeResponse).
   */
  async create(
    discountType: ICreateDiscountTypeRequest,
  ): Promise<IDiscountTypeResponse> {
    const { ...rest } = await discountTypes.create(discountType);
    return rest;
  }

  /**
   * updates an existing discount type in the repository.
   * @param discountType - the updated details of the discount type (IUpdateDiscountTypeRequest).
   * @returns a Promise that resolves to the updated discount type (IDiscountTypeResponse).
   */
  async update(
    discountType: IUpdateDiscountTypeRequest,
  ): Promise<IDiscountTypeResponse> {
    const { ...rest } = await discountTypes.update(discountType);
    return rest;
  }
}
