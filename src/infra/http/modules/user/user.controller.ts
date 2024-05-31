import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserBody } from './dtos/createUserBody';
import { UserViewModel } from './viewModel/userViewModel';
import { CreateUserUseCase } from './../../../../modules/user/useCases/createUserUseCase/createUserUseCase';

@Controller('user')
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  async createUser(@Body() userBody: CreateUserBody) {
    const { name, email, password } = userBody;

    const user = await this.createUserUseCase.execute({
      name,
      email,
      password,
    });

    return UserViewModel.toHttp(user);
  }
}
