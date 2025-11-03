import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthController (e2e, mocked)', () => {
  let app: INestApplication;

  const mockAuthService = {
    login: jest
      .fn()
      .mockResolvedValue({ accessToken: 'a1', refreshToken: 'r1' }),
    register: jest
      .fn()
      .mockResolvedValue({ accessToken: 'a2', refreshToken: 'r2' }),
    refresh: jest
      .fn()
      .mockResolvedValue({ accessToken: 'a3', refreshToken: 'r3' }),
    logout: jest.fn().mockResolvedValue({ success: true }),
  } as Partial<AuthService>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider('APP_GUARD')
      .useValue({ canActivate: () => true })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/auth/login sets header and body', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'a@a.com', password: 'x' })
      .expect(201);
    expect(res.headers['authorization']).toBeDefined();
    expect(res.body).toEqual({ accessToken: 'a1', refreshToken: 'r1' });
  });

  it('/api/auth/refresh from body', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: 'r1' })
      .expect(201);
    expect(res.headers['authorization']).toBeDefined();
    expect(res.body).toEqual({ accessToken: 'a3', refreshToken: 'r3' });
  });

  it('/api/auth/logout', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .send({ refreshToken: 'r1' })
      .expect(201);
    expect(res.body).toEqual({ success: true });
  });
});
