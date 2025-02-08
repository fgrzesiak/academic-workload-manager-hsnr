import {
  $Enums,
  Controller,
  User as IUser,
  Teacher,
} from "@workspace/database";

import { ICreateTeacherRequest } from "./teacher.type";

// utility type that makes all properties optional except for the specified required keys
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

interface IUserResponseSpecific {
  Teacher?: Teacher;
  Controller?: Controller;
}

export interface ICreateUserSpecificRequest {
  relation: ICreateTeacherRequest | undefined;
}

export interface IUpdateUserSpecificRequest {
  Teacher?: Teacher;
  Controller?: Controller;
}

// defines the response type for a User, including only specific properties
export type IUserResponse = Omit<IUser, "password"> & IUserResponseSpecific;

// defines the request type for creating a new User
export type ICreateUserRequest = Omit<IUser, "createdAt" | "updatedAt"> &
  ICreateUserSpecificRequest;

// defines the request type for updating an existing User, with optional fields except for the required `id`
export type IUpdateUserRequest = OptionalExceptFor<
  IUser & IUpdateUserSpecificRequest,
  "id"
>;

// enum for user roles (Teacher and Controller)
export const UserRole: typeof $Enums.Role = {
  TEACHER: "TEACHER",
  CONTROLLER: "CONTROLLER",
};

// class representing a User, including methods for initialization and serialization
export class User implements IUser {
  id!: number; // unique identifier for the user
  username!: string; // username of the user
  firstName!: string; // first name of the user
  lastName!: string; // last name of the user
  password!: string; // password for the user (excluded from serialization)
  isPasswordTemporary!: boolean; // indicates if the user's password is temporary
  role!: $Enums.Role; // role of the user (Teacher or Controller)
  createdAt!: Date; // timestamp for when the user was created
  updatedAt!: Date; // timestamp for the last update to the user

  /**
   * constructor for the User class.
   * @param data - the raw IUser data used to initialize the instance.
   */
  constructor(private data: IUser) {
    Object.assign(this, data);
  }

  /**
   * serializes the instance into a plain JSON object.
   * excludes sensitive fields like `password`.
   * @returns the serialized user data without the password.
   */
  toJSON() {
    const { password, ...rest } = this.data as IUser;
    return rest;
  }

  /**
   * factory method to create a User instance from JSON data.
   * initializes dates and sets the password field to an empty string.
   * @param data - the serialized `IUserResponse` object.
   * @returns a new `User` instance initialized with the provided data.
   */
  static fromJSON(data: IUserResponse) {
    return new User({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      password: "",
    });
  }
}
