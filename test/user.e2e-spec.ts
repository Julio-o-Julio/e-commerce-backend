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

  let accessToken: string;

  const user = makeUser({});
  const createUserBody = {
    name: user.name,
    email: user.email,
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

    const responseSignIn = await request(app.getHttpServer())
      .post('/signin')
      .send({
        email: user.email,
        password: user.password,
      });

    accessToken = responseSignIn.body.access_token;
  });

  afterAll(async () => {
    const responseSignIn = await request(app.getHttpServer())
      .post('/signin')
      .send({
        email: 'NewUser@gmail.com',
        password: user.password,
      });

    const accessToken = responseSignIn.body.access_token;

    await request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await app.close();
  });

  describe('POST /user', () => {
    it('Deve ser capaz de criar um User', async () => {
      const createNewUserBody = {
        name: user.name,
        email: 'NewUser@gmail.com',
        password: user.password,
      };

      // Cria o User e espera um status code 201 (CREATED)
      const response = await request(app.getHttpServer())
        .post('/user')
        .send(createNewUserBody)
        .expect(201);

      // Testa se todos os campos do User foi criado corretamente
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(createNewUserBody.email);
      expect(response.body.name).toBe(createNewUserBody.name);
      expect(response.body).toHaveProperty('createdAt');
    });
  });

  describe('PUT /user/updatename', () => {
    it('Deve ser capaz de alterar o campo name do User', async () => {
      const nameChanged = 'Nome Alterado';

      const updateUserNameBody = {
        name: nameChanged,
        email: user.email,
      };

      // Altera o nome do User e espera um status code 200 (OK)
      const response = await request(app.getHttpServer())
        .put('/user/updatename')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserNameBody)
        .expect(200);

      // Testa se o nome foi alterado corretamente
      expect(response.body.name).toEqual(nameChanged);
    });
  });

  describe('PUT /user/updatepassword', () => {
    it('Deve ser capaz de alterar o campo password do User', async () => {
      const passwordChanged = 'SenhaAlterada';

      const updateUserPasswordBody = {
        email: user.email,
        password: passwordChanged,
      };

      // Altera a senha do User e espera um status code 200 (OK)
      await request(app.getHttpServer())
        .put('/user/updatepassword')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserPasswordBody)
        .expect(200);

      // Faz o login usando a senha nova e espera um status code 200 (OK)
      await request(app.getHttpServer())
        .post('/signin')
        .send(updateUserPasswordBody)
        .expect(200);
    });
  });

  describe('DELETE /user', () => {
    it('Deve ser capaz de deletar um User', async () => {
      // Deleta um User e espera um status code 200 (OK)
      await request(app.getHttpServer())
        .delete('/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
