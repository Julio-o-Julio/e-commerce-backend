import { JwtService } from '@nestjs/jwt';
import { SignInUseCase } from './signInUseCase';
import { makeUser } from 'src/modules/user/factories/userFactory';
import { UserPayload } from '../../models/userPayload';

let signInUseCase: SignInUseCase;
let jwtService: JwtService;

describe('Entrar (login/signIn)', () => {
  beforeEach(() => {
    jwtService = new JwtService({ secret: 'secret' });
    signInUseCase = new SignInUseCase(jwtService);
  });

  it('Deve ser capaz de criar um token de acesso válido', async () => {
    const user = makeUser({});

    const token = await signInUseCase.execute({
      user,
    });

    const payload = jwtService.decode(token) as UserPayload;

    expect(payload.sub).toEqual(user.id);
  });
});
