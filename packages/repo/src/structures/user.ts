import { User as IUser } from "@workspace/database";
import { $Enums } from "@workspace/database";
import { injectable } from "tsyringe";

// marks the class as injectable for dependency injection
@injectable()
export class User implements IUser {
  id!: number; // unique identifier for the user
  username!: string; // the username chosen by the user
  password!: string; // the user's password (note: this may be hashed in a real-world scenario)
  isPasswordTemporary!: boolean; // flag indicating if the password is temporary
  role!: $Enums.Role; // the role assigned to the user (teacher or controller)
  createdAt!: Date; // timestamp for when the user was created
  updatedAt!: Date; // timestamp for the last update to the user's data

  // constructor to initialize the User instance with provided data
  constructor(private data: IUser) {
    Object.assign(this, data); // assigns the provided data to the class properties
  }

  // method to convert the user instance to a plain JSON object
  toJSON() {
    return this.data; // returns the raw user data as a plain object
  }
}