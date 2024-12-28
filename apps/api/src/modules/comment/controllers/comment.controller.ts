import {
  Body,
  Controller,
  Get,
  Post,
  Put,
} from "@nestjs/common";
import {
  ICreateCommentRequest,
  IUpdateCommentRequest,
  ICommentResponse,
} from "@workspace/shared";

import { Auth } from "../../../common/decorators/auth.decorator";
import { Role } from "../../../common/enums/role.enum";
import { CommentService } from "../services/comment.service";

@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get("/")
  @Auth(Role.CONTROLLER)
  async comment(): Promise<ICommentResponse[]> {
    return await this.commentService.findAll();
  }

  @Post("/")
  @Auth(Role.CONTROLLER)
  async createComment(@Body() comment: ICreateCommentRequest): Promise<ICommentResponse> {
    return await this.commentService.create(comment);
  }

  @Put("/")
  @Auth(Role.CONTROLLER)
  async updateComment(@Body() comment: IUpdateCommentRequest): Promise<ICommentResponse> {
    return await this.commentService.update(comment);
  }
}
