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
    email: 'AuthEmail@gmail.com',
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

    it('Deve ser capaz de retornar um erro quando tentar fazer login e o email do User estiver errado', async () => {
      // Tenta efetuar o login e espera um status code 401 (UNAUTHORIZED)
      const responseSignIn = await request(app.getHttpServer())
        .post('/signin')
        .send({
          email: 'FakeEmail@gmail.com',
          password: createUserBody.password,
        })
        .expect(401);

      // Testa se a resposta do login tem um campo message
      expect(responseSignIn.body).toHaveProperty('message');
      // Testa se o campo message da resposta do login é "Email ou senha incorretos"
      expect(responseSignIn.body.message).toEqual('Email ou senha incorretos');
    });

    it('Deve ser capaz de retornar um erro quando tentar fazer login e a senha do User estiver errada', async () => {
      // Tenta efetuar o login e espera um status code 401 (UNAUTHORIZED)
      const responseSignIn = await request(app.getHttpServer())
        .post('/signin')
        .send({
          email: createUserBody.email,
          password: 'FakePassword',
        })
        .expect(401);

      // Testa se a resposta do login tem um campo message
      expect(responseSignIn.body).toHaveProperty('message');
      // Testa se o campo message da resposta do login é "Email ou senha incorretos"
      expect(responseSignIn.body.message).toEqual('Email ou senha incorretos');
    });
  });

  describe('PUT /user/*', () => {
    it('Deve ser capaz de retornar um erro quando tentar alterar o nome de um User e o access_token do User estiver incorreto ou expirado', async () => {
      // Tenta alterar o nome de um User e espera um status code 401 (UNAUTHORIZED)
      const response = await request(app.getHttpServer())
        .put('/user/updatename')
        .set('Authorization', `Bearer ${accessToken}+FakeAccessToken`)
        .expect(401);

      // Testa se a resposta da requisição tem um campo message
      expect(response.body).toHaveProperty('message');
      // Testa se o campo message da resposta da requisição é "Access token expirado ou inválido"
      expect(response.body.message).toEqual(
        'Access token expirado ou inválido',
      );
    });

    it('Deve ser capaz de retornar um erro quando tentar alterar a senha de um User e o access_token do User estiver incorreto ou expirado', async () => {
      // Tenta alterar a senha de um User e espera um status code 401 (UNAUTHORIZED)
      const response = await request(app.getHttpServer())
        .put('/user/updatepassword')
        .set('Authorization', `Bearer ${accessToken}+FakeAccessToken`)
        .expect(401);

      // Testa se a resposta da requisição tem um campo message
      expect(response.body).toHaveProperty('message');
      // Testa se o campo message da resposta da requisição é "Access token expirado ou inválido"
      expect(response.body.message).toEqual(
        'Access token expirado ou inválido',
      );
    });
  });

  describe('DELETE /user', () => {
    it('Deve ser capaz de retornar um erro quando tentar deletar um User e o access_token do User estiver incorreto ou expirado', async () => {
      // Tenta deletar um User e espera um status code 401 (UNAUTHORIZED)
      const response = await request(app.getHttpServer())
        .delete('/user')
        .set('Authorization', `Bearer ${accessToken}+FakeAccessToken`)
        .expect(401);

      // Testa se a resposta da requisição tem um campo message
      expect(response.body).toHaveProperty('message');
      // Testa se o campo message da resposta da requisição é "Access token expirado ou inválido"
      expect(response.body.message).toEqual(
        'Access token expirado ou inválido',
      );
    });
  });

  describe('POST /addresses', () => {
    it('Deve ser capaz de retornar um erro quando tentar criar um Address e o access_token do User estiver incorreto ou expirado', async () => {
      const createNewAddressBody = {
        postalCode: '88888-888',
        houseNumber: 88,
      };

      // Tenta criar um Address e espera um status code 401 (UNAUTHORIZED)
      const response = await request(app.getHttpServer())
        .post('/addresses')
        .set('Authorization', `Bearer ${accessToken}+FakeAccessToken`)
        .send(createNewAddressBody)
        .expect(401);

      // Testa se a resposta da requisição tem um campo message
      expect(response.body).toHaveProperty('message');
      // Testa se o campo message da resposta da requisição é "Access token expirado ou inválido"
      expect(response.body.message).toEqual(
        'Access token expirado ou inválido',
      );
    });
  });

  describe('GET /addresses/:id', () => {
    it('Deve ser capaz de retornar um erro quando tentar recuperar um Address e o access_token do User estiver incorreto ou expirado', async () => {
      const createNewAddressBody = {
        postalCode: '88888-888',
        houseNumber: 88,
      };

      // Cria um Address e espera um status code 201 (CREATED)
      const responseCreateAddress = await request(app.getHttpServer())
        .post('/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createNewAddressBody)
        .expect(201);

      // Tenta recuperar um Address e espera um status code 401 (UNAUTHORIZED)
      const response = await request(app.getHttpServer())
        .get(`/addresses/${responseCreateAddress.body.id}`)
        .set('Authorization', `Bearer ${accessToken}+FakeAccessToken`)
        .expect(401);

      // Testa se a resposta da requisição tem um campo message
      expect(response.body).toHaveProperty('message');
      // Testa se o campo message da resposta da requisição é "Access token expirado ou inválido"
      expect(response.body.message).toEqual(
        'Access token expirado ou inválido',
      );
    });
  });

  describe('GET MANY /addresses', () => {
    it('Deve ser capaz de retornar um erro quando tentar recuperar todos os Address e o access_token do User estiver incorreto ou expirado', async () => {
      // Tenta recuperar todos os Address e espera um status code 401 (UNAUTHORIZED)
      const response = await request(app.getHttpServer())
        .get('/addresses')
        .set('Authorization', `Bearer ${accessToken}+FakeAccessToken`)
        .expect(401);

      // Testa se a resposta da requisição tem um campo message
      expect(response.body).toHaveProperty('message');
      // Testa se o campo message da resposta da requisição é "Access token expirado ou inválido"
      expect(response.body.message).toEqual(
        'Access token expirado ou inválido',
      );
    });
  });

  describe('PUT /addresses/:id', () => {
    it('Deve ser capaz de retornar um erro quando tentar alterar um Address e o access_token do User estiver incorreto ou expirado', async () => {
      const createNewAddressBody = {
        postalCode: '88888-888',
        houseNumber: 88,
      };

      const updateNewAddressBody = {
        postalCode: '11111-111',
        houseNumber: 11,
        description: 'Apto 1',
      };

      // Cria um Address e espera um status code 201 (CREATED)
      const responseCreateAddress = await request(app.getHttpServer())
        .post('/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createNewAddressBody)
        .expect(201);

      // Tenta alterar um Address e espera um status code 401 (UNAUTHORIZED)
      const response = await request(app.getHttpServer())
        .put(`/addresses/${responseCreateAddress.body.id}`)
        .set('Authorization', `Bearer ${accessToken}+FakeAccessToken`)
        .send(updateNewAddressBody)
        .expect(401);

      // Testa se a resposta da requisição tem um campo message
      expect(response.body).toHaveProperty('message');
      // Testa se o campo message da resposta da requisição é "Access token expirado ou inválido"
      expect(response.body.message).toEqual(
        'Access token expirado ou inválido',
      );
    });
  });

  describe('DELETE /addresses/:id', () => {
    it('Deve ser capaz de retornar um erro quando tentar deletar um Address e o access_token do User estiver incorreto ou expirado', async () => {
      const createNewAddressBody = {
        postalCode: '88888-888',
        houseNumber: 88,
      };

      // Cria um Address e espera um status code 201 (CREATED)
      const responseCreateAddress = await request(app.getHttpServer())
        .post('/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createNewAddressBody)
        .expect(201);

      // Tenta deletar um Address e espera um status code 401 (UNAUTHORIZED)
      const response = await request(app.getHttpServer())
        .delete(`/addresses/${responseCreateAddress.body.id}`)
        .set('Authorization', `Bearer ${accessToken}+FakeAccessToken`)
        .expect(401);

      // Testa se a resposta da requisição tem um campo message
      expect(response.body).toHaveProperty('message');
      // Testa se o campo message da resposta da requisição é "Access token expirado ou inválido"
      expect(response.body.message).toEqual(
        'Access token expirado ou inválido',
      );
    });
  });
});
