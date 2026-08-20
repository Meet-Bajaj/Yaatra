import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { RatingModule } from './modules/rating/rating.module';
import { NotificationModule } from './modules/notification/notification.module';
import { DriverModule } from './modules/driver/driver.module';
import { RideModule } from './modules/ride/ride.module';
import { MatchingModule } from './modules/matching/matching.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { PaymentModule } from './modules/payment/payment.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { SafetyModule } from './modules/safety/safety.module';
import { KycModule } from './modules/kyc/kyc.module';
import { PlacesModule } from './modules/places/places.module';
import { AdminModule } from './modules/admin/admin.module';
import { LocationModule } from './modules/location/location.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    RatingModule,
    NotificationModule,
    DriverModule,
    RideModule,
    MatchingModule,
    PricingModule,
    PaymentModule,
    WalletModule,
    SafetyModule,
    KycModule,
    PlacesModule,
    AdminModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
