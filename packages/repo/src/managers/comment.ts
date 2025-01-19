import { Comment as IComment } from "@workspace/database";
import { ICreateCommentRequest, IUpdateCommentRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { Comment } from "../structures/index.js";

// marks the class as a singleton for dependency injection
@singleton()
export class CommentManager {
  // constructor initializes the service with PrismaService instance
  constructor(private prisma: PrismaService) {}

  // finds a comment by its ID
  async findOne(commentId: number): Promise<Comment | null> {
    try {
      // tries to find a unique comment using its ID
      const result = await this.prisma.comment.findUniqueOrThrow({
        where: { commentId },
      });

      return new Comment(result); // returns the found comment as an instance of the Comment class
    } catch (_err) {
      return null; // returns null if an error occurs (e.g., comment not found)
    }
  }

  // updates the details of an existing comment
  async update(comment: IUpdateCommentRequest): Promise<Comment> {
    const { commentId } = comment; // extracts the comment ID from the input
    const result = await this.prisma.comment.update({
      data: comment, // data to update the comment with
      where: { commentId }, // finds the comment by ID
    });
    return new Comment(result); // returns the updated comment as an instance of the Comment class
  }

  // retrieves all comments
  async findAll(): Promise<IComment[]> {
    return await this.prisma.comment.findMany(); // retrieves all comments from the database
  }

  // creates a new comment
  async create(comment: ICreateCommentRequest): Promise<Comment> {
    const result = await this.prisma.comment.create({ data: comment }); // creates a new comment in the database
    return new Comment(result); // returns the newly created comment as an instance of the Comment class
  }
}
