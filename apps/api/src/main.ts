import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { ConfigKeys, ConfigService } from "./modules/config/config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [new ConfigService().get(ConfigKeys.FRONTEND_URL)],
  });

  await app.listen(4000);
}

void bootstrap();
