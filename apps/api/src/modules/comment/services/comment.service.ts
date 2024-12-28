import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { comments } from "@workspace/repo";
import {
  ICreateCommentRequest,
  IUpdateCommentRequest,
  ICommentResponse,
} from "@workspace/shared";

@Injectable()
export class CommentService {
  constructor(private readonly jwtService: JwtService) {}

  async findAll(): Promise<ICommentResponse[]> {
    return (await comments.findAll()).map((comment) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...rest } = comment;
      return rest;
    });
  }

  async create(comment: ICreateCommentRequest): Promise<ICommentResponse> {
    const { ...rest } = await comments.create(comment);
    return rest;
  }

  async update(comment: IUpdateCommentRequest): Promise<ICommentResponse> {
    const { ...rest } = await comments.update(comment);
    return rest;
  }
}
