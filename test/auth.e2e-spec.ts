import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationError } from 'class-validator';
import { IncorrectValuesException } from '../src/exceptions/incorrectValuesException';
import { mapperClassValidationErrorToAppException } from '../src/utils/mappers';
import { makeUser } from '../src/modules/user/factories/userFactory';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;

  let accessToken: string;

  const user = makeUser({});
  const createUserBody = {
    name: user.name,
    email: 'userauth@gmail.com',
    password: user.password,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory(errors: ValidationError[]) {
          throw new IncorrectValuesException({
            fields: mapperClassValidationErrorToAppException(errors),
          });
        },
      }),
    );

    await app.init();

    await request(app.getHttpServer()).post('/user').send(createUserBody);
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${accessToken}`);

    await app.close();
  });

  describe('POST /signin', () => {
    it('Deve ser capaz de realizar o login do User com email e senha e retornar um access token', async () => {
      // Efetua o login e espera um status code 200 (OK)
      const responseSignin = await request(app.getHttpServer())
        .post('/signin')
        .send({
          email: createUserBody.email,
          password: createUserBody.password,
        })
        .expect(200);

      // Testa se a resposta do login tem um campo access_token
      expect(responseSignin.body).toHaveProperty('access_token');

      accessToken = responseSignin.body.access_token;
    });
  });
});
