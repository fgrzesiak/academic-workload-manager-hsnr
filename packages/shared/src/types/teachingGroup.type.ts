import { TeachingGroup as ITeachingGroup } from "@workspace/database";

// utility type that makes all properties optional except for the specified required keys
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>;

// defines the response type for a teaching group, including only specific properties
export type ITeachingGroupResponse = Pick<
  ITeachingGroup,
  "id" | "groupName" | "groupDescription" | "groupBalance"
>;

// defines the request type for creating a new teaching group
export type ICreateTeachingGroupRequest = Pick<
  ITeachingGroup,
  "groupName" | "groupDescription" | "groupBalance"
>;

// defines the request type for updating an existing teaching group, with optional fields except for required ones
export type IUpdateTeachingGroupRequest = OptionalExceptFor<
  Pick<
    ITeachingGroup,
    "id" | "groupName" | "groupDescription" | "groupBalance"
  >,
  "id"
>;

// class representing a teaching group, including methods for initialization and serialization
export class TeachingGroup implements ITeachingGroup {
  id!: number; // unique identifier for the teaching group
  groupName!: string; // name of the teaching group
  groupDescription!: string | null; // description of the teaching group
  groupBalance!: number; // balance of the teaching group

  /**
   * constructor for the TeachingGroup class.
   * @param data - the raw ITeachingGroup data used to initialize the instance.
   */
  constructor(private data: ITeachingGroup) {
    Object.assign(this, data); // assign all properties from `data` to the instance
  }

  /**
   * serializes the instance into a plain JSON object.
   * @returns the serialized teaching group data.
   */
  toJSON() {
    const { ...rest } = this.data as ITeachingGroup; // include all fields in the serialized object
    return rest; // return the object representation
  }

  /**
   * factory method to create a TeachingGroup instance from JSON data.
   * @param data - the serialized `ITeachingGroupResponse` object.
   * @returns a new `TeachingGroup` instance initialized with the provided data.
   */
  static fromJSON(data: ITeachingGroupResponse) {
    return new TeachingGroup({ ...data }); // create a new TeachingGroup instance
  }
}
