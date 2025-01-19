import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./http-exception.filter";
import { ConfigKeys, ConfigService } from "./modules/config/config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // use the http exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter());

  // enable cors with the allowed frontend url from the config
  app.enableCors({
    origin: [new ConfigService().get(ConfigKeys.FRONTEND_URL)],
  });

  // start the application and listen on port 4000
  await app.listen(4000);
}

void bootstrap();
