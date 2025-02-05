import { Injectable, OnModuleInit } from "@nestjs/common";
import { controllers } from "@workspace/repo";
import * as bcrypt from "bcrypt";

import { Role } from "./common/enums/role.enum";
import { ConfigKeys, ConfigService } from "./modules/config/config.service";

/**
 * service to initialize the default controller during application startup
 */
@Injectable()
export class InitControllerService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Initializes the module by ensuring that a controller exists with the initial credentials.
   *
   * This method performs the following steps:
   * 1. Checks if a controller already exists in the database.
   * 2. Retrieves the initial controller's username and password from the configuration.
   * 3. Hashes the initial controller's password.
   * 4. If a controller already exists, updates the controller's username and password.
   * 5. If no controller exists, creates a new controller with default values and the initial credentials.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   */
  async onModuleInit() {
    const existingController = await controllers.findFirst(); // check if a controller already exists
    const username = this.configService.get(
      ConfigKeys.FIRST_CONTROLLER_USERNAME,
    );
    const firstName = this.configService.get(
      ConfigKeys.FIRST_CONTROLLER_FIRSTNAME,
    );
    const lastName = this.configService.get(
      ConfigKeys.FIRST_CONTROLLER_LASTNAME,
    );
    const plainPassword = this.configService.get(
      ConfigKeys.FIRST_CONTROLLER_PASSWORD,
    );
    const hashedPassword = await bcrypt.hash(plainPassword, 10); // hash the password

    if (existingController) {
      await controllers.update(
        existingController.id,
        {},
        {
          username,
          firstName,
          lastName,
          password: hashedPassword,
        },
      );
    } else {
      await controllers.create(
        {}, // currently no additional controller data is required
        {
          username,
          firstName,
          lastName,
          password: hashedPassword,
          isPasswordTemporary: false,
          role: Role.CONTROLLER,
        },
      );
    }
  }
}
