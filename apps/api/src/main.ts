import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for mobile app access
  app.enableCors({
    origin: true, // Allow all origins (for development)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  // Global validation pipe (Zod or class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Global error filter (standard error format)
  app.useGlobalFilters(new HttpExceptionFilter());
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 RetainAI API running on http://0.0.0.0:${port}`);
  console.log(`📱 Accessible from network at http://192.168.1.152:${port}`);
}

bootstrap();

