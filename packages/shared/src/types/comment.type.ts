import { Comment as IComment } from "@workspace/database";

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

export type ICommentResponse = Pick<IComment, "commentId" | "commentContent" | "commentDate" | "userId">;

export type ICreateCommentRequest = Pick<
  IComment,
  "commentId" | "commentContent" | "commentDate" | "userId"
>;

export type IUpdateCommentRequest = OptionalExceptFor<
  Pick<IComment, "commentId" | "commentContent" | "commentDate" | "userId">,
  "commentId"
>;

export class Comment implements IComment {
  commentId!: number;
  commentContent!: string;
  commentDate!: Date;
  userId!: number;

  constructor(private data: IComment) {
    Object.assign(this, data);
  }

  toJSON() {
    const { ...rest } = this.data as IComment;
    return rest;
  }

  static fromJSON(data: ICommentResponse) {
    return new Comment({...data});
  }
}
