import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { comments } from "@workspace/repo";
import {
  ICommentResponse,
  ICreateCommentRequest,
  IUpdateCommentRequest,
} from "@workspace/shared";

// marks the service as injectable so it can be used by other parts of the application
@Injectable()
export class CommentService {
  // injects the JwtService for potential token-related operations
  constructor(private readonly jwtService: JwtService) {}

  /**
   * retrieves all comments from the repository.
   * @returns a Promise that resolves to an array of comment responses (ICommentResponse[]).
   */
  async findAll(): Promise<ICommentResponse[]> {
    return (await comments.findAll()).map((comment) => {
      // removes unnecessary fields from the response before returning
      const { ...rest } = comment;
      return rest;
    });
  }

  /**
   * creates a new comment in the repository.
   * @param comment - the details of the comment to create (ICreateCommentRequest).
   * @returns a Promise that resolves to the created comment (ICommentResponse).
   */
  async create(comment: ICreateCommentRequest): Promise<ICommentResponse> {
    const { ...rest } = await comments.create(comment);
    return rest;
  }

  /**
   * updates an existing comment in the repository.
   * @param comment - the updated details of the comment (IUpdateCommentRequest).
   * @returns a Promise that resolves to the updated comment (ICommentResponse).
   */
  async update(comment: IUpdateCommentRequest): Promise<ICommentResponse> {
    const { ...rest } = await comments.update(comment);
    return rest;
  }
}
