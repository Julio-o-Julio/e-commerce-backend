import { Body, Controller, Delete, Post, Put, Request } from '@nestjs/common';
import { CreateUserBody } from './dtos/createUserBody';
import { UserViewModel } from './viewModel/userViewModel';
import { CreateUserUseCase } from './../../../../modules/user/useCases/createUserUseCase/createUserUseCase';
import { Public } from '../auth/decorators/isPublic';
import { UpdateUserNameUseCase } from '../../../../modules/user/useCases/updateUserNameUseCase/updateUserNameUseCase';
import { UpdateUserPasswordUseCase } from '../../../../modules/user/useCases/updateUserPasswordUseCase/updateUserPasswordUseCase';
import { DeleteUserUseCase } from '../../../../modules/user/useCases/deleteUserUseCase/deleteUserUseCase';
import { AuthenticatedRequestModel } from '../auth/models/authenticatedRequestModel';
import { UpdateUserNameBody } from './dtos/updateUserNameBody';
import { UpdateUserPasswordBody } from './dtos/updateUserPasswordBody';

@Controller('user')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private updateUserNameUseCase: UpdateUserNameUseCase,
    private updateUserPasswordUseCase: UpdateUserPasswordUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @Public()
  async createUser(@Body() userBody: CreateUserBody) {
    const { name, email, password } = userBody;

    const user = await this.createUserUseCase.execute({
      name,
      email,
      password,
    });

    return UserViewModel.toHttp(user);
  }

  @Put('updateName')
  async updateUserName(
    @Request() request: AuthenticatedRequestModel,
    @Body() body: UpdateUserNameBody,
  ) {
    const { name } = body;

    const user = await this.updateUserNameUseCase.execute({
      id: request.user.id,
      name,
      email: request.user.email,
    });

    return UserViewModel.toHttp(user);
  }

  @Put('updatePassword')
  async updateUserPassword(
    @Request() request: AuthenticatedRequestModel,
    @Body() body: UpdateUserPasswordBody,
  ) {
    const { password } = body;

    await this.updateUserPasswordUseCase.execute({
      id: request.user.id,
      email: request.user.email,
      password,
    });
  }

  @Delete()
  async deleteUser(@Request() request: AuthenticatedRequestModel) {
    await this.deleteUserUseCase.execute({
      id: request.user.id,
      email: request.user.email,
    });
  }
}
