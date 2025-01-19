import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { discounts } from "@workspace/repo";
import {
  ICreateDiscountRequest,
  IUpdateDiscountRequest,
  IDiscountResponse,
} from "@workspace/shared";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class DiscountService {
  // injects the JwtService for potential token-related operations
  constructor(private readonly jwtService: JwtService) {}

  /**
   * retrieves all discount records from the repository.
   * @returns a Promise that resolves to an array of discount responses (IDiscountResponse[]).
   */
  async findAll(): Promise<IDiscountResponse[]> {
    return (await discounts.findAll()).map((discount) => {
      // removes unnecessary fields from the response before returning
      const { ...rest } = discount;
      return rest;
    });
  }

  /**
   * creates a new discount record in the repository.
   * @param discount - the details of the discount to create (ICreateDiscountRequest).
   * @returns a Promise that resolves to the created discount record (IDiscountResponse).
   */
  async create(discount: ICreateDiscountRequest): Promise<IDiscountResponse> {
    const { ...rest } = await discounts.create(discount);
    return rest;
  }

  /**
   * updates an existing discount record in the repository.
   * @param discount - the updated details of the discount (IUpdateDiscountRequest).
   * @returns a Promise that resolves to the updated discount record (IDiscountResponse).
   */
  async update(discount: IUpdateDiscountRequest): Promise<IDiscountResponse> {
    const { ...rest } = await discounts.update(discount);
    return rest;
  }

  /**
   * deletes a discount record from the repository.
   * @param id - the ID of the discount record to delete.
   * @returns a Promise that resolves when the deletion is complete.
   */
  async delete(id: number) {
    await discounts.delete(id);
  }
}
