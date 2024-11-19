import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./http-exception.filter";
import { ConfigKeys, ConfigService } from "./modules/config/config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: [new ConfigService().get(ConfigKeys.FRONTEND_URL)],
  });

  await app.listen(4000);
}

void bootstrap();
