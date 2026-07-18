import { NestFactory } from '@nestjs/core';
import dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT);
  console.log('Server is running on port:', process.env.PORT);
  console.log('Server is running on port', port);

  await app.listen(port);
}

bootstrap();
