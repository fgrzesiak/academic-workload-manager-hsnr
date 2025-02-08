import { Body, Controller, Get, Post, Put } from "@nestjs/common";
import {
  ICommentResponse,
  ICreateCommentRequest,
  IUpdateCommentRequest,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { CommentService } from "../services/comment.service";

// controller for managing comments
@Controller("comment")
export class CommentController {
  // injects the CommentService to handle business logic
  constructor(private readonly commentService: CommentService) {}

  /**
   * endpoint: GET /
   * role: only accessible by users with the CONTROLLER role
   * purpose: retrieves a list of all comments
   * returns: an array of ICommentResponse objects
   */
  @Get("/")
  @Auth(Role.CONTROLLER)
  async comment(): Promise<ICommentResponse[]> {
    return await this.commentService.findAll();
  }

  /**
   * endpoint: POST /
   * role: only accessible by users with the CONTROLLER role
   * purpose: creates a new comment
   * request body: ICreateCommentRequest - contains details of the comment to create
   * returns: the created comment as an ICommentResponse object
   */
  @Post("/")
  @Auth(Role.CONTROLLER)
  async createComment(
    @Body() comment: ICreateCommentRequest,
  ): Promise<ICommentResponse> {
    return await this.commentService.create(comment);
  }

  /**
   * endpoint: PUT /
   * role: only accessible by users with the CONTROLLER role
   * purpose: updates an existing comment
   * request body: IUpdateCommentRequest - contains updated details of the comment
   * returns: the updated comment as an ICommentResponse object
   */
  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateComment(
    @Body() comment: IUpdateCommentRequest,
  ): Promise<ICommentResponse> {
    return await this.commentService.update(comment);
  }
}
