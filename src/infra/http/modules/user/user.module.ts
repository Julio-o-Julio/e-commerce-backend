import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DatabaseModule } from './../../../../infra/database/database.module';
import { CreateUserUseCase } from './../../../../modules/user/useCases/createUserUseCase/createUserUseCase';
import { UpdateUserNameUseCase } from '../../../../modules/user/useCases/updateUserNameUseCase/updateUserNameUseCase';
import { UpdateUserPasswordUseCase } from '../../../../modules/user/useCases/updateUserPasswordUseCase/updateUserPasswordUseCase';
import { DeleteUserUseCase } from '../../../../modules/user/useCases/deleteUserUseCase/deleteUserUseCase';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    UpdateUserNameUseCase,
    UpdateUserPasswordUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule {}
