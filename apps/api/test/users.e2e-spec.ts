import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/modules/users/users.service';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';

describe('UsersController (e2e, mocked)', () => {
  let app: INestApplication;

  const mockUsersService = {
    create: jest.fn().mockResolvedValue({ id: '1', email: 'a@a.com' }),
    findAll: jest.fn().mockResolvedValue([{ id: '1', email: 'a@a.com' }]),
    findOneById: jest.fn().mockResolvedValue({ id: '1', email: 'a@a.com' }),
    update: jest.fn().mockResolvedValue({ id: '1', email: 'b@b.com' }),
    remove: jest.fn().mockResolvedValue({ success: true }),
  } as Partial<UsersService>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider('APP_GUARD')
      .useValue({ canActivate: () => true })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/users (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', 'Bearer test')
      .send({ displayName: 'A', email: 'a@a.com', password: 'x' })
      .expect(201);
    expect(res.body).toEqual({ id: '1', email: 'a@a.com' });
  });

  it('/api/users (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', 'Bearer test')
      .expect(200);
    expect(res.body).toEqual([{ id: '1', email: 'a@a.com' }]);
  });

  it('/api/users/:id (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users/1')
      .set('Authorization', 'Bearer test')
      .expect(200);
    expect(res.body).toEqual({ id: '1', email: 'a@a.com' });
  });

  it('/api/users/:id (PATCH)', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/users/1')
      .set('Authorization', 'Bearer test')
      .send({ email: 'b@b.com' })
      .expect(200);
    expect(res.body).toEqual({ id: '1', email: 'b@b.com' });
  });

  it('/api/users/:id (DELETE)', async () => {
    const res = await request(app.getHttpServer())
      .delete('/api/users/1')
      .set('Authorization', 'Bearer test')
      .expect(200);
    expect(res.body).toEqual({ success: true });
  });
});
