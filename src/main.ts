import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.CORS_ORIGIN ?? 'http://localhost:4200', 'https://ticketing-system-silk.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
