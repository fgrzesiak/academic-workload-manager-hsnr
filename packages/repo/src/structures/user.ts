import { User as IUser } from "@workspace/database";
import { $Enums } from "@workspace/database";
import { injectable } from "tsyringe";

import { users } from "../managers";

@injectable()
export class User implements IUser {
  id!: number;
  username!: string;
  password!: string;
  role!: $Enums.Role;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(private data: IUser) {
    Object.assign(this, data);
  }

  toJSON() {
    return this.data;
  }

  /**
   * Update user
   */
  async update(data: Partial<Omit<IUser, "id" | "createdAt" | "updatedAt">>) {
    Object.assign(this, data);
    await users.update(this.id, data);
  }
}
