import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationError } from 'class-validator';
import { IncorrectValuesException } from '../src/exceptions/incorrectValuesException';
import { mapperClassValidationErrorToAppException } from '../src/utils/mappers';
import { makeUser } from '../src/modules/user/factories/userFactory';
import { makeAddress } from '../src/modules/address/factories/addressFactory';
import { Address } from '../src/modules/address/entities/Address';

describe('Address Controller (e2e)', () => {
  let app: INestApplication;

  let accessToken: string;

  let responseCreateUser: any;
  let address: Address;

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

    const user = makeUser({});
    const createUserBody = {
      name: user.name,
      email: 'AddressEmail@gmail.com',
      password: user.password,
    };

    responseCreateUser = await request(app.getHttpServer())
      .post('/user')
      .send(createUserBody)
      .expect(201);

    const responseSignIn = await request(app.getHttpServer())
      .post('/signin')
      .send({
        email: createUserBody.email,
        password: createUserBody.password,
      })
      .expect(200);

    accessToken = responseSignIn.body.access_token;

    address = makeAddress({});
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await app.close();
  });

  describe('POST /addresses', () => {
    it('Deve ser capaz de criar um Address com o campo Description preenchido', async () => {
      const createNewAddressBody = {
        postalCode: address.postalCode,
        houseNumber: address.houseNumber,
        description: address.description,
      };

      // Cria um Address e espera um status code 201 (CREATED)
      const response = await request(app.getHttpServer())
        .post('/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createNewAddressBody)
        .expect(201);

      // Testa se todos os campos do Address foi criado corretamente
      expect(response.body).toHaveProperty('id');
      expect(response.body.postalCode).toBe(createNewAddressBody.postalCode);
      expect(response.body.houseNumber).toBe(createNewAddressBody.houseNumber);
      expect(response.body.description).toBe(createNewAddressBody.description);
      expect(response.body.userId).toBe(responseCreateUser.id);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('Deve ser capaz de criar um Address sem o campo Description preenchido', async () => {
      const createNewAddressBody = {
        postalCode: address.postalCode,
        houseNumber: address.houseNumber,
      };

      // Cria um Address e espera um status code 201 (CREATED)
      const response = await request(app.getHttpServer())
        .post('/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createNewAddressBody)
        .expect(201);

      // Testa se todos os campos do Address foi criado corretamente
      expect(response.body).toHaveProperty('id');
      expect(response.body.postalCode).toEqual(createNewAddressBody.postalCode);
      expect(response.body.houseNumber).toEqual(
        createNewAddressBody.houseNumber,
      );
      expect(response.body.description).toEqual(null);
      expect(response.body.userId).toEqual(responseCreateUser.id);
      expect(response.body).toHaveProperty('createdAt');

      address = response.body;
    });
  });

  describe('GET /addresses/:id', () => {
    it('Deve ser capaz de retornar um Address', async () => {
      // Tenta pegar o endereço pelo id e espera um erro 200 (OK)
      const response = await request(app.getHttpServer())
        .get(`/addresses/${address.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Testa se todos os campos do Address foi retornado corretamente
      expect(response.body.id).toEqual(address.id);
      expect(response.body.postalCode).toEqual(address.postalCode);
      expect(response.body.houseNumber).toEqual(address.houseNumber);
      expect(response.body.description).toEqual(address.description);
    });
  });

  describe('GET MANY /addresses', () => {
    it('Deve ser capaz de retornar uma lista de Address', async () => {
      // Cria vários endereços fictícios
      const addressesToCreate = [
        {
          postalCode: '12345-678',
          houseNumber: 1,
          description: 'Description 1',
        },
        {
          postalCode: '23456-789',
          houseNumber: 2,
          description: 'Description 2',
        },
        {
          postalCode: '34567-890',
          houseNumber: 3,
          description: 'Description 3',
        },
      ];

      for (const address of addressesToCreate) {
        await request(app.getHttpServer())
          .post('/addresses')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(address)
          .expect(201);
      }

      // Faz a requisição para obter a lista de endereços e espera um status 200 (OK)
      const response = await request(app.getHttpServer())
        .get('/addresses')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Testa se o corpo da resposta é um array
      expect(Array.isArray(response.body)).toBeTruthy();

      // Testa se o array contém pelo menos o número de endereços que foram criados
      expect(response.body.length).toBeGreaterThanOrEqual(
        addressesToCreate.length,
      );

      // Testa se todos os campos de cada Address estão presentes e corretos
      response.body.forEach((address: Address) => {
        expect(address).toHaveProperty('id');
        expect(address).toHaveProperty('postalCode');
        expect(address).toHaveProperty('houseNumber');
        expect(address).toHaveProperty('description');
      });

      // Testa se os endereços criados estão na lista
      addressesToCreate.forEach((createdAddress) => {
        const foundAddress = response.body.find(
          (addr: Address) => addr.postalCode === createdAddress.postalCode,
        );
        expect(foundAddress).toBeTruthy();
        expect(foundAddress.houseNumber).toEqual(createdAddress.houseNumber);
        expect(foundAddress.description).toEqual(createdAddress.description);
      });
    });
  });

  describe('PUT /addresses/:id', () => {
    it('Deve ser capaz de alterar os campos de um Address', async () => {
      const updateAddressBody = {
        postalCode: '00000-000',
        houseNumber: 99,
        description: 'Apto 6',
      };

      // Altera um Address e espera um status code 200 (OK)
      const response = await request(app.getHttpServer())
        .put(`/addresses/${address.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateAddressBody)
        .expect(200);

      // Testa se todos os campos do Address foi alterado corretamente
      expect(response.body.postalCode).toEqual(updateAddressBody.postalCode);
      expect(response.body.houseNumber).toEqual(updateAddressBody.houseNumber);
      expect(response.body.description).toEqual(updateAddressBody.description);
    });
  });

  describe('DELETE /addresses/:id', () => {
    it('Deve ser capaz de deletar um Address', async () => {
      // Deleta um Address e espera um status code 200 (OK)
      await request(app.getHttpServer())
        .delete(`/addresses/${address.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Tenta pegar o endereço pelo id e espera um erro 404 (NOT_FOUND)
      const responseAddressRequest = await request(app.getHttpServer())
        .get(`/addresses/${address.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      // Testa se a resposta da request é o erro esperado
      expect(responseAddressRequest.body).toHaveProperty('message');
      expect(responseAddressRequest.body.message).toEqual(
        'Endereço não encontrado',
      );
    });
  });
});
