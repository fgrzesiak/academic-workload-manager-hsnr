import { User as IUser, Role } from "@workspace/database";
import { ICreateUserRequest, IUpdateUserRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { User } from "../structures/index.js";

@singleton()
export class UserManager {
  constructor(private prisma: PrismaService) {}

  // Find a user by ID, including the Teacher or Controller relation based on the user's role
  async findOne(id: number): Promise<User | null> {
    try {
      const result = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
          Teacher: true, // Include Teacher relation if it exists
          Controller: true, // Include Controller relation if it exists
        },
      });

      return new User(result);
    } catch (_err) {
      return null;
    }
  }

  // Find a user by username, including the Teacher or Controller relation
  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.prisma.user.findUniqueOrThrow({
        where: { username },
        /* include: {
          Teacher: true,
          Controller: true,
        }, */
      });

      return new User(result);
    } catch (_err) {
      return null;
    }
  }

  // Update user details; for Teacher/Controller-specific fields, handle separately in their services if necessary
  async update(user: IUpdateUserRequest): Promise<User> {
    const { id } = user;
    const result = await this.prisma.user.update({
      data: user,
      where: { id },
    });
    return new User(result);
  }

  async findAll(): Promise<IUser[]> {
    return await this.prisma.user.findMany();
  }

  async create(user: ICreateUserRequest): Promise<User> {
    const { firstName, lastName, ...rest } = user;
    const result = await this.prisma.user.create({
      data: {
        ...rest,
        ...(Role.CONTROLLER === rest.role
          ? {
              Controller: {
                create: {
                  firstName,
                  lastName,
                },
              },
            }
          : {
              Teacher: {
                create: {
                  firstName,
                  lastName,
                  retirementDate: new Date(), // TODO: set a proper value
                  totalTeachingDuty: 0, // TODO: set a proper value
                },
              },
            }),
      },
    });
    return new User(result);
  }
}
