import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './../../../../modules/auth/strategies/local.strategy';
import { ValidateUserUseCase } from './../../../../modules/auth/useCases/validateUserUseCase/validateUserUseCase';
import { SignInDtoValidateMiddleware } from './middleware/signInDtoValidate.middleware';
import { SignInUseCase } from './../../../../modules/auth/useCases/signInUseCase/signInUseCase';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './../../../database/database.module';
import { JwtStrategy } from '../../../../modules/auth/strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, ValidateUserUseCase, SignInUseCase],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignInDtoValidateMiddleware).forRoutes('/signIn');
  }
}
