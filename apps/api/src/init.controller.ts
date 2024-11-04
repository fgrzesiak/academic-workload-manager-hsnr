import { Injectable, OnModuleInit } from "@nestjs/common";
import { users } from "@workspace/repo";
import * as bcrypt from "bcrypt";

import { ConfigKeys, ConfigService } from "./modules/config/config.service";

@Injectable()
export class InitControllerService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const existingController = await users.findFirstController();
    if (!existingController) {
      const username = this.configService.get(
        ConfigKeys.INITIAL_CONTROLLER_USERNAME,
      );
      const plainPassword = this.configService.get(
        ConfigKeys.INITIAL_CONTROLLER_PASSWORD,
      );
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      await users.create({
        username,
        password: hashedPassword,
        role: "CONTROLLER",
      });
      console.log("Created initial controller with username: ", username);
    }
  }
}
