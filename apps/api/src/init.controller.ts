import { Injectable, OnModuleInit } from "@nestjs/common";
import { controllers } from "@workspace/repo";
import * as bcrypt from "bcrypt";

import { ConfigKeys, ConfigService } from "./modules/config/config.service";

@Injectable()
export class InitControllerService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const existingController = await controllers.findFirst();
    if (!existingController) {
      const username = this.configService.get(
        ConfigKeys.INITIAL_CONTROLLER_USERNAME,
      );
      const plainPassword = this.configService.get(
        ConfigKeys.INITIAL_CONTROLLER_PASSWORD,
      );
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      await controllers.create(
        {
          firstName: "Initial",
          lastName: "Controller",
        },
        {
          username,
          password: hashedPassword,
          isPasswordTemporary: true, //TODO: change to fals
          role: "CONTROLLER",
        },
      );
      console.log("Created initial controller with username: ", username);
    }
  }
}
