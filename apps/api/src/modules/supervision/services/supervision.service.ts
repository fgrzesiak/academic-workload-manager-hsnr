import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { supervisions } from "@workspace/repo";
import {
  ICreateSupervisionRequest,
  IUpdateSupervisionRequest,
  ISupervisionResponse,
} from "@workspace/shared";

@Injectable()
export class SupervisionService {
  constructor(private readonly jwtService: JwtService) {}

  async findAll(): Promise<ISupervisionResponse[]> {
    return (await supervisions.findAll()).map((supervision) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...rest } = supervision;
      return rest;
    });
  }

  async create(supervision: ICreateSupervisionRequest): Promise<ISupervisionResponse> {
    const { ...rest } = await supervisions.create(supervision);
    return rest;
  }

  async update(supervision: IUpdateSupervisionRequest): Promise<ISupervisionResponse> {
    const { ...rest } = await supervisions.update(supervision);
    return rest;
  }

  async delete(id: number) {
    await supervisions.delete(id);
  }
}
