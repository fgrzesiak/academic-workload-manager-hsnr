import { Comment as IComment } from "@workspace/database";
import { ICreateCommentRequest, IUpdateCommentRequest } from "@workspace/shared";
import { singleton } from "tsyringe";

import { PrismaService } from "../services/index.js";
import { Comment } from "../structures/index.js";

@singleton()
export class CommentManager {
  constructor(private prisma: PrismaService) {}

  // Find comment by Id
  async findOne(commentId: number): Promise<Comment | null> {
    try {
      const result = await this.prisma.comment.findUniqueOrThrow({
        where: { commentId },
      });

      return new Comment(result);
    } catch (_err) {
      return null;
    }
  }

  // Update comment details
  async update(comment: IUpdateCommentRequest): Promise<Comment> {
    const { commentId } = comment;
    const result = await this.prisma.comment.update({
      data: comment,
      where: { commentId },
    });
    return new Comment(result);
  }

  async findAll(): Promise<IComment[]> {
    return await this.prisma.comment.findMany();
  }

  async create(comment: ICreateCommentRequest): Promise<Comment> {
    const result = await this.prisma.comment.create({ data: comment });
    return new Comment(result);
  }
}
