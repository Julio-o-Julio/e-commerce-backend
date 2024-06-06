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

  describe('POST /signin', () => {
    it('Deve ser capaz de realizar o login do User com email e senha e retornar um access token', async () => {
      const user = makeUser({
        email: 'auth@gmail.com'
      });

      const userPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
      };

      await request(app.getHttpServer())
        .post('/user')
        .send(userPayload)
        .expect(201);

      const userCredentials = {
        email: user.email,
        password: user.password,
      };

      const response = await request(app.getHttpServer())
        .post('/signin')
        .send(userCredentials)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');

      const accessToken = response.body.access_token;

      await request(app.getHttpServer())
        .delete('/user')
        .set('Authorization', `Bearer ${accessToken}`);
    });
  });
});
