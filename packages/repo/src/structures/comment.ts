import { Comment as IComment } from "@workspace/database";
import { injectable } from "tsyringe";

// marks the class as injectable for dependency injection
@injectable()
export class Comment implements IComment {
  commentId!: number; // the unique identifier for the comment
  commentContent!: string; // the content or text of the comment
  commentDate!: Date; // the date when the comment was created
  userId!: number; // the user ID associated with the comment

  // constructor to initialize the comment with data
  constructor(private data: IComment) {
    Object.assign(this, data); // assigns the provided data to the class properties
  }

  // method to convert the comment instance to a JSON object
  toJSON() {
    return this.data; // returns the raw data as a plain object
  }
}
