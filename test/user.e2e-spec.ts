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
      expect(response.body.email).toEqual(
        createNewUserBody.email.toLowerCase(),
      );
      expect(response.body.name).toEqual(createNewUserBody.name);
      expect(response.body).toHaveProperty('createdAt');
    });

    const testCases = [
      {
        description: 'quando o campo name não for informado',
        createNewUserBody: {
          email: 'NewUser@gmail.com',
          password: user.password,
        },
        expectedField: 'name',
        expectedMessage: 'O campo name é obrigatório',
      },
      {
        description: 'quando o campo email não for informado',
        createNewUserBody: {
          name: user.name,
          password: user.password,
        },
        expectedField: 'email',
        expectedMessage: 'O campo email é obrigatório',
      },
      {
        description: 'quando o campo password não for informado',
        createNewUserBody: {
          name: user.name,
          email: 'NewUser@gmail.com',
        },
        expectedField: 'password',
        expectedMessage: 'O campo password é obrigatório',
      },
    ];

    testCases.forEach(
      ({ description, createNewUserBody, expectedField, expectedMessage }) => {
        it(`Não deve ser capaz de criar um User ${description}`, async () => {
          const response = await request(app.getHttpServer())
            .post('/user')
            .send(createNewUserBody)
            .expect(400);

          // Testa se as mensagens do erro estão corretas
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toEqual('Dados inválidos');
          expect(response.body).toHaveProperty('fields');
          expect(response.body.fields[expectedField]).toEqual(expectedMessage);
        });
      },
    );
  });

  describe('PUT /user/updatename', () => {
    it('Deve ser capaz de alterar o campo name do User', async () => {
      const nameChanged = 'Nome Alterado';

      const updateUserNameBody = {
        name: nameChanged,
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

    const testCases = [
      {
        description: 'quando o campo name não for informado',
        updateUserNameBody: {},
        expectedField: 'name',
        expectedMessage: 'O campo name é obrigatório',
      },
      {
        description: 'quando o campo name não for uma string',
        updateUserNameBody: {
          name: 2,
        },
        expectedField: 'name',
        expectedMessage: 'O campo name deve ser um texto',
      },
    ];

    testCases.forEach(
      ({ description, updateUserNameBody, expectedField, expectedMessage }) => {
        it(`Não deve ser capaz de atualizar o nome de um User ${description}`, async () => {
          const response = await request(app.getHttpServer())
            .put('/user/updatename')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updateUserNameBody)
            .expect(400);

          // Testa se as mensagens do erro estão corretas
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toEqual('Dados inválidos');
          expect(response.body).toHaveProperty('fields');
          expect(response.body.fields[expectedField]).toEqual(expectedMessage);
        });
      },
    );
  });

  describe('PUT /user/updatepassword', () => {
    it('Deve ser capaz de alterar o campo password do User', async () => {
      const passwordChanged = 'SenhaAlterada';

      const updateUserPasswordBody = {
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
        .send({ email: user.email, password: passwordChanged })
        .expect(200);
    });

    it('Não deve ser capaz de atualizar a senha de um User quando o campo password não for informado', async () => {
      const response = await request(app.getHttpServer())
        .put('/user/updatepassword')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);

      // Testa se as mensagens do erro estão corretas
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('Dados inválidos');
      expect(response.body).toHaveProperty('fields');
      expect(response.body.fields['password']).toEqual(
        'O campo password é obrigatório',
      );
    });

    const testCases = [
      {
        description: 'quando o campo password não for informado',
        updatePasswordBody: {},
        expectedField: 'password',
        expectedMessage: 'O campo password é obrigatório',
      },
      {
        description: 'quando o campo password não for uma string',
        updateUserPasswordBody: {
          password: 22222222,
        },
        expectedField: 'password',
        expectedMessage: 'O campo password deve ser um texto',
      },
      {
        description: 'quando o campo password não tiver no mínimo 8 caracteres',
        updateUserPasswordBody: {
          password: 'senha',
        },
        expectedField: 'password',
        expectedMessage: 'O campo password deve ter no mínimo 8 caracteres',
      },
    ];

    testCases.forEach(
      ({
        description,
        updateUserPasswordBody,
        expectedField,
        expectedMessage,
      }) => {
        it(`Não deve ser capaz de atualizar a senha de um User ${description}`, async () => {
          const response = await request(app.getHttpServer())
            .put('/user/updatepassword')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updateUserPasswordBody)
            .expect(400);

          // Testa se as mensagens do erro estão corretas
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toEqual('Dados inválidos');
          expect(response.body).toHaveProperty('fields');
          expect(response.body.fields[expectedField]).toEqual(expectedMessage);
        });
      },
    );
  });

  describe('DELETE /user', () => {
    it('Deve ser capaz de deletar um User', async () => {
      // Deleta um User e espera um status code 200 (OK)
      await request(app.getHttpServer())
        .delete('/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Tenta deletar um User e espera um status code 404 (NOT_FOUND)
      await request(app.getHttpServer())
        .delete('/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
