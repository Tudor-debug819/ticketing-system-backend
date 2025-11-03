import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, cb) => {
      const allowList = [
        'http://localhost:4200',
        'http://127.0.0.1:4200',
        'https://ticketing-system-silk.vercel.app',
      ];
      if (!origin) return cb(null, true); // Postman etc.
      if (allowList.includes(origin) || /\.vercel\.app$/.test(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // elimină câmpuri necunoscute (ex. statuz)
      forbidNonWhitelisted: true,    // aruncă 400 dacă apare ceva în plus
      transform: true,               // convertește automat string->number
      transformOptions: { enableImplicitConversion: true },
    }),
  );


  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
