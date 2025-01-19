import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { users } from "@workspace/repo";
import {
  ChangePasswordResponse,
  ICreateUserRequest,
  IUpdateUserRequest,
  IUserResponse,
} from "@workspace/shared";
import * as bcrypt from "bcrypt";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class UsersService {
  // injects the JwtService for potential token-related operations
  constructor(private readonly jwtService: JwtService) {}

  /**
   * retrieves all users from the repository.
   * @returns a Promise that resolves to an array of user responses (IUserResponse[]), excluding passwords.
   */
  async findAll(): Promise<IUserResponse[]> {
    return (await users.findAll()).map((user) => {
      // removes the password field from the response to avoid exposing sensitive information
      const { password, ...rest } = user;
      return rest;
    });
  }

  /**
   * creates a new user in the repository.
   * @param user - the details of the user to create (ICreateUserRequest).
   * @returns a Promise that resolves to the created user (IUserResponse).
   */
  async create(user: ICreateUserRequest): Promise<IUserResponse> {
    // hashes the user's password before saving it
    user.password = await bcrypt.hash(user.password, 10);
    const { password, ...rest } = await users.create(user);
    return rest;
  }

  /**
   * updates an existing user in the repository.
   * @param user - the updated details of the user (IUpdateUserRequest).
   * @returns a Promise that resolves to the updated user (IUserResponse).
   */
  async update(user: IUpdateUserRequest): Promise<IUserResponse> {
    const { password, ...rest } = await users.update(user);
    return rest;
  }

  /**
   * changes the password of an existing user.
   * @param id - the ID of the user whose password is to be changed.
   * @param password - the new password to set.
   * @returns a Promise that resolves to a response indicating success (ChangePasswordResponse).
   */
  async changePassword(
    id: number,
    password: string,
  ): Promise<ChangePasswordResponse> {
    // hashes the new password before updating it
    const hashedPassword = await bcrypt.hash(password, 10);
    await users.update({
      id,
      password: hashedPassword,
      isPasswordTemporary: false, // marks the password as no longer temporary
    });
    return { success: true };
  }
}
