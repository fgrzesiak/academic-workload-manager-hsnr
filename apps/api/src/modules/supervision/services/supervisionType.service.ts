import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { supervisionTypes } from "@workspace/repo";
import {
  ICreateSupervisionTypeRequest,
  IUpdateSupervisionTypeRequest,
  ISupervisionTypeResponse,
} from "@workspace/shared";

@Injectable()
export class SupervisionTypeService {
  constructor(private readonly jwtService: JwtService) {}

  async findAll(): Promise<ISupervisionTypeResponse[]> {
    return (await supervisionTypes.findAll()).map((supervisionType) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...rest } = supervisionType;
      return rest;
    });
  }

  async create(supervisionType: ICreateSupervisionTypeRequest): Promise<ISupervisionTypeResponse> {
    const { ...rest } = await supervisionTypes.create(supervisionType);
    return rest;
  }

  async update(supervisionType: IUpdateSupervisionTypeRequest): Promise<ISupervisionTypeResponse> {
    const { ...rest } = await supervisionTypes.update(supervisionType);
    return rest;
  }
}
