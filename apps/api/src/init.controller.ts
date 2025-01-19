import { Injectable, OnModuleInit } from "@nestjs/common";
import { controllers } from "@workspace/repo";
import * as bcrypt from "bcrypt";

import { ConfigKeys, ConfigService } from "./modules/config/config.service";

/**
 * service to initialize the default controller during application startup
 */
@Injectable()
export class InitControllerService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  /**
   * hook executed when the module is initialized
   * checks for an existing controller and creates a default one if none exists
   */
  async onModuleInit() {
    const existingController = await controllers.findFirst(); // check if a controller already exists
    if (!existingController) {
      const username = this.configService.get(
        ConfigKeys.INITIAL_CONTROLLER_USERNAME, // get initial username
      );
      const plainPassword = this.configService.get(
        ConfigKeys.INITIAL_CONTROLLER_PASSWORD, // get initial password
      );
      const hashedPassword = await bcrypt.hash(plainPassword, 10); // hash the password

      // create the initial controller
      await controllers.create(
        {
          firstName: "Initial", // default first name
          lastName: "Controller", // default last name
        },
        {
          username, // use the configured username
          password: hashedPassword, // save the hashed password
          isPasswordTemporary: true, //TODO: change to fals
          role: "CONTROLLER", // set the role to "controller"
        },
      );
      console.log("Created initial controller with username: ", username);
    }
  }
}
