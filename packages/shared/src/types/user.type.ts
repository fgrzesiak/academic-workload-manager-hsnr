import {
  $Enums,
  Controller,
  User as IUser,
  Teacher,
} from "@workspace/database";

export type IUserResponse = Omit<IUser, "password">;

type UserCommon = {
  [K in keyof Teacher & keyof Controller]: Teacher[K] & Controller[K];
};

export type ICreateUserRequest = Omit<
  IUser,
  "id" | "createdAt" | "updatedAt" | "isPasswordTemporary"
> &
  Omit<UserCommon, "id" | "userId">;

export const UserRole: typeof $Enums.Role = {
  TEACHER: "TEACHER",
  CONTROLLER: "CONTROLLER",
};

export class User implements IUser {
  id!: number;
  username!: string;
  password!: string;
  isPasswordTemporary!: boolean;
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
