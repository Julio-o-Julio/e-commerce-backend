import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationError } from 'class-validator';
import { IncorrectValuesException } from '../src/exceptions/incorrectValuesException';
import { mapperClassValidationErrorToAppException } from '../src/utils/mappers';
import { makeUser } from '../src/modules/user/factories/userFactory';

describe('User Controller (e2e)', () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  const user = makeUser({});

  describe('POST /user', () => {
    it('Deve ser capaz de criar um User', async () => {
      const userPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(userPayload)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(user.email);
      expect(response.body.name).toBe(user.name);
    });
  });

  describe('DELETE /user', () => {
    it('Deve ser capaz de deletar um User', async () => {
      const userCredentials = {
        email: user.email,
        password: user.password,
      };

      const responseSignIn = await request(app.getHttpServer())
        .post('/signin')
        .send(userCredentials)
        .expect(200);

      expect(responseSignIn.body).toHaveProperty('access_token');

      const accessToken = responseSignIn.body.access_token;

      await request(app.getHttpServer())
        .delete('/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
