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

  let responseCreateUser;
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

    const userModel = makeUser({});
    const createUserBody = {
      name: userModel.name,
      email: 'AddressEmail@gmail.com',
      password: userModel.password,
    };

    responseCreateUser = await request(app.getHttpServer())
      .post('/user')
      .send(createUserBody)
      .expect(200);

    const responseSignIn = await request(app.getHttpServer())
      .post('/signin')
      .send({
        email: responseCreateUser.body.email,
        password: responseCreateUser.body.password,
      })
      .expect(200);

    accessToken = responseSignIn.body.access_token;

    address = makeAddress({
      userId: responseCreateUser.body.id,
    });
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${accessToken}`);

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
      expect(response.body.postalCode).toBe(createNewAddressBody.postalCode);
      expect(response.body.houseNumber).toBe(createNewAddressBody.houseNumber);
      expect(response.body.description).toBe(null);
      expect(response.body.userId).toBe(responseCreateUser.id);
      expect(response.body).toHaveProperty('createdAt');
    });
  });
});
