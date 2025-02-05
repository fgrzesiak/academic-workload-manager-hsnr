import { User as IUser, Role } from "@workspace/database";
import { ICreateUserRequest, IUpdateUserRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { User } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class UserManager {
  constructor(private prisma: PrismaService) {}

  // find a user by ID, including the Teacher or Controller relation based on the user's role
  async findOne(id: number): Promise<User | null> {
    try {
      const result = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
          Teacher: true, // include Teacher relation if it exists
          Controller: true, // include Controller relation if it exists
        },
      });

      return new User(result); // returns the found user as an instance of User
    } catch (_err) {
      return null; // returns null if the user is not found or an error occurs
    }
  }

  // find a user by username, including the Teacher or Controller relation
  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.prisma.user.findUniqueOrThrow({
        where: { username },
        /* include: {
          Teacher: true,
          Controller: true,
        }, */
      });

      return new User(result); // returns the found user as an instance of User
    } catch (_err) {
      return null; // returns null if the user is not found or an error occurs
    }
  }

  // update user details; for Teacher/Controller-specific fields, handle separately in their services if necessary
  async update(user: IUpdateUserRequest): Promise<User> {
    const { id, createdAt, role, Teacher, Controller, ...rest } = user;
    rest.updatedAt = new Date(); // sets the updated date to the current date and time

    let result;
    if (Teacher) {
      const { id, userId, ...teacherData } = Teacher; // we can't update keys, so we exclude `id` and `userId`
      console.log(rest);
      result = await this.prisma.user.update({
        data: {
          ...rest,
          Teacher: {
            update: {
              data: teacherData,
            },
          },
        },
        where: { id: userId },
      });
    } else if (Controller) {
      const { id, userId, ...controllerData } = Controller; // we can't update keys, so we exclude `id` and `userId`
      result = await this.prisma.user.update({
        data: {
          ...rest,
          Controller: {
            update: {
              data: controllerData,
            },
          },
        },
        where: { id: userId },
      });
    } else {
      result = await this.prisma.user.update({
        data: rest,
        where: { id },
      });
    }

    return new User(result); // returns the updated user as an instance of User
  }

  // find all users
  async findAll(): Promise<IUser[]> {
    return await this.prisma.user.findMany({
      include: {
        Teacher: true, // include Teacher relation if it exists
        Controller: true, // include Controller relation if it exists
      },
    }); // returns all user records from the database
  }

  // create a new user, along with their Teacher or Controller relation based on the role
  async create(user: ICreateUserRequest): Promise<User> {
    const { role, relation, ...rest } = user;
    const result = await this.prisma.user.create({
      data: {
        role,
        ...rest,
        ...(role === Role.TEACHER && relation
          ? {
              Teacher: {
                create: {
                  ...relation,
                },
              },
            }
          : { Controller: { create: {} } }),
      },
    });

    return new User(result); // returns the newly created user as an instance of User
  }
}
