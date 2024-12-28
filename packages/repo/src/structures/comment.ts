import { Comment as IComment } from "@workspace/database";
import { injectable } from "tsyringe";

@injectable()
export class Comment implements IComment {
  commentId!: number;
  commentContent!: string;
  commentDate!: Date;
  userId!: number;

  constructor(private data: IComment) {
    Object.assign(this, data);
  }

  toJSON() {
    return this.data;
  }
}