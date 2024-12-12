import {
  $Enums,
  Controller,
  User as IUser,
  Teacher,
} from "@workspace/database";

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

export type IUserResponse = Omit<IUser, "password">;

type UserCommon = {
  [K in keyof Teacher & keyof Controller]: Teacher[K] & Controller[K];
};

export type ICreateUserRequest = Pick<
  IUser,
  "password" | "role" | "username" | "isPasswordTemporary"
> &
  Pick<UserCommon, "firstName" | "lastName">;

export type IUpdateUserRequest = OptionalExceptFor<
  Pick<IUser, "id" | "username" | "password" | "isPasswordTemporary">,
  "id"
>;

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
