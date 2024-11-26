import { $Enums, User as IUser } from "@workspace/database";

export type IUserResponse = Omit<IUser, "password">;

export const UserRole: typeof $Enums.Role = {
  TEACHER: "TEACHER",
  CONTROLLER: "CONTROLLER",
};

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
    const { password, ...rest } = this.data as IUser;
    return rest;
  }

  static fromJSON(data: IUserResponse) {
    return new User({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      password: "",
    });
  }
}
