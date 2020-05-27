import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import dotenv = require('dotenv');
import {NestExpressApplication} from '@nestjs/platform-express';
import hbs from 'express-handlebars';
import {join} from 'path';

import {moduleFactory} from './app.module';

const {parsed} = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = {...parsed, ...process.env};

async function bootstrap(): Promise<void> {
  const nestApp = await NestFactory.create<NestExpressApplication>(
    moduleFactory(),
  );

  nestApp.set('view engine', 'hbs');

  nestApp.engine(
    'hbs',
    hbs({
      defaultLayout: 'main',
      extname: 'hbs',
      layoutsDir: join(__dirname, '..', 'views'),
      partialsDir: join(__dirname, '..', 'views/partials'),
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('google-sheet')
    .setVersion('0.0')
    .build();

  const document = SwaggerModule.createDocument(nestApp, options);

  SwaggerModule.setup('/swagger', nestApp, document);

  nestApp.enableCors();

  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await nestApp.listen(parsed.APP_PORT);

  console.info(`Server started at http://localhost:${parsed.APP_PORT}`);
  // console.info(
  //   `Swagger started at http://localhost:${parsed.APP_PORT}/swagger`,
  // );
}

bootstrap();
