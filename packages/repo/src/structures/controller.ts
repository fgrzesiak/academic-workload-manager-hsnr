import { Controller as IController } from "@workspace/database";
import { injectable } from "tsyringe";

import { controllers } from "../managers/index.js";

// marks the class as injectable for dependency injection
@injectable()
export class Controller implements IController {
  id!: number; // the unique identifier for the controller
  userId!: number; // the user ID associated with the controller
  firstName!: string; // the first name of the controller
  lastName!: string; // the last name of the controller

  // constructor to initialize the controller with data
  constructor(private data: IController) {
    Object.assign(this, data); // assigns the provided data to the class properties
  }

  // method to convert the controller instance to a JSON object
  toJSON() {
    return this.data; // returns the raw data as a plain object
  }

  /**
   * update user
   * updates the controller's data with the provided partial data
   * @param data - partial data to update the controller
   */
  async update(data: Partial<Omit<IController, "id">>) {
    Object.assign(this, data); // updates the current controller instance with new data
    await controllers.update(this.id, data); // persists the updated controller data using the controllers manager
  }
}
