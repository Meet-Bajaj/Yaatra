import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { RatingModule } from './modules/rating/rating.module';
import { NotificationModule } from './modules/notification/notification.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    RatingModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
