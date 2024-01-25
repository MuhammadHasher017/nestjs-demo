import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import fastifyCookie from '@fastify/cookie';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './core/config/configuration.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      rawBody: true,
    },
  );
  app.enableCors({
    allowedHeaders: ['content-type', 'authorization'],
    credentials: true,
  });

  app.getHttpAdapter().getInstance().register(fastifyCookie);

  const { internalConfig: config }: { internalConfig: Configuration } =
    app.get(ConfigService);
  app.setGlobalPrefix('api');

  await app.listen(config.port, '0.0.0.0', () => {
    Logger.log(
      `API running at http://0.0.0.0:${config.port} in "${process.env.NODE_ENV}" mode`,
      'Main',
    );
  });
}
bootstrap();
