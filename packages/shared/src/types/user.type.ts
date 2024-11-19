import { User } from "@workspace/database";

export type IUserResponse = Omit<User, "password">;
