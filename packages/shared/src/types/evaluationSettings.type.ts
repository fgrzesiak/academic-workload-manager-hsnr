import { EvaluationSettings as IEvaluationSettings } from "@workspace/database";

// utility type that makes all properties optional except for the specified required keys
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

// defines the response type for a evaluation setting, including only specific properties
export type IEvaluationSettingsResponse = Pick<
  IEvaluationSettings,
  "id" | "key" | "value" | "dataType"
>;

// defines the request type for creating a new evaluation setting
export type ICreateEvaluationSettingsRequest = Pick<
  IEvaluationSettings,
  "key" | "value" | "dataType"
>;

// defines the request type for updating an existing evaluation setting, with optional fields except for the required `id`
export type IUpdateEvaluationSettingsRequest = OptionalExceptFor<
  Pick<
    IEvaluationSettings,
    "id" | "key" | "value" | "dataType"
  >,
  "id"
>;

// class representing a evaluation setting, including methods for initialization and serialization
export class EvaluationSettings implements IEvaluationSettings {
  id!: number; // unique identifier for the evaluation setting
  key!: string; // name of the evaluation setting
  value!: string; // value of the evaluation setting
  dataType!: string; // data type of the evaluation setting

  /**
   * constructor for the EvaluationSettings class.
   * @param data - the raw IEvaluationSettings data used to initialize the instance.
   */
  constructor(private data: IEvaluationSettings) {
    Object.assign(this, data); // assign all properties from `data` to the instance
  }

  /**
   * serializes the instance into a plain JSON object.
   * @returns the serialized evaluation setting data.
   */
  toJSON() {
    const { ...rest } = this.data as IEvaluationSettings; // include all fields in the serialized object
    return rest; // return the object representation
  }

  /**
   * factory method to create a EvaluationSettings instance from JSON data.
   * @param data - the serialized `IEvaluationSettingsResponse` object.
   * @returns a new `EvaluationSettings` instance initialized with the provided data.
   */
  static fromJSON(data: IEvaluationSettingsResponse) {
    return new EvaluationSettings(data); // create a new EvaluationSettings instance
  }
}