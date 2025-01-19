import { Comment as IComment } from "@workspace/database";

// utility type that makes all properties optional except for the specified required keys
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

// defines the response type for a comment, including only specific properties
export type ICommentResponse = Pick<
  IComment,
  "commentId" | "commentContent" | "commentDate" | "userId"
>;

// defines the request type for creating a new comment
export type ICreateCommentRequest = Pick<
  IComment,
  "commentContent" | "commentDate" | "userId"
>;

// defines the request type for updating an existing comment, with optional fields except for required ones
export type IUpdateCommentRequest = OptionalExceptFor<
  Pick<IComment, "commentId" | "commentContent" | "commentDate" | "userId">,
  "commentId"
>;

// class representing a comment, including methods for initialization and serialization
export class Comment implements IComment {
  commentId!: number; // unique identifier for the comment
  commentContent!: string; // content of the comment
  commentDate!: Date; // date when the comment was created
  userId!: number; // identifier of the user who made the comment

  /**
   * constructor for the Comment class.
   * @param data - the raw IComment data used to initialize the instance.
   */
  constructor(private data: IComment) {
    Object.assign(this, data); // assign all properties from `data` to the instance
  }

  /**
   * serializes the instance into a plain JSON object.
   * @returns the serialized comment data.
   */
  toJSON() {
    const { ...rest } = this.data as IComment; // include all fields in the serialized object
    return rest; // return the object representation
  }

  /**
   * factory method to create a Comment instance from JSON data.
   * @param data - the serialized `ICommentResponse` object.
   * @returns a new `Comment` instance initialized with the provided data.
   */
  static fromJSON(data: ICommentResponse) {
    return new Comment({ ...data }); // create a new Comment instance
  }
}
