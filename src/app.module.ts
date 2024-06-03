import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './infra/database/database.module';
import { AuthModule } from './infra/http/modules/auth/auth.module';
import { JwtAuthGuard } from './infra/http/modules/auth/guards/jwtAuth.guard';
import { UserModule } from './infra/http/modules/user/user.module';
import { AppController } from './app.controller';
import { AddressModule } from './infra/http/modules/address/address.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, AddressModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
