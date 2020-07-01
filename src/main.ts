import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('v1');

  const options = new DocumentBuilder()
    .setTitle('Postgram API')
    .setDescription(
      'Postgram - an API to schedule, and repost media on instagram.',
    )
    .addServer(`http://${process.env.HOST}:${process.env.PORT}`)
    .addServer(`http://localhost:${process.env.PORT}`)
    .setVersion('1.0')
    .addApiKey(null, 'X-USER')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT);
}

bootstrap();
