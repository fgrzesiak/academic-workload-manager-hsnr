import { Controller as IController } from "@workspace/database";
import { injectable } from "tsyringe";

import { controllers } from "../managers/index.js";

@injectable()
export class Controller implements IController {
  id!: number;
  userId!: number;
  firstName!: string;
  lastName!: string;

  constructor(private data: IController) {
    Object.assign(this, data);
  }

  toJSON() {
    return this.data;
  }

  /**
   * Update user
   */
  async update(data: Partial<Omit<IController, "id">>) {
    Object.assign(this, data);
    await controllers.update(this.id, data);
  }
}
