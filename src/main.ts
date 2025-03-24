import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  const version = '1.0';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3000;

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Attendance App API')
    .setDescription('The API of Attendify attendance app')
    .setVersion(version)
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());
  app.use(helmet({ contentSecurityPolicy: false }));

  app.enableCors({ origin: '*', credentials: true });

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
void bootstrap();
