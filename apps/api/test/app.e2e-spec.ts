import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/modules/users/users.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue({
        findAll: jest.fn().mockResolvedValue([]),
        findOneById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('GET /api/health should return health status', async () => {
      const response = await request(
        app.getHttpServer() as unknown as Parameters<typeof request>[0],
      )
        .get('/api/health')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('app');
      expect((response.body as { app: { status: string } }).app).toHaveProperty(
        'status',
      );
      expect(response.body).toHaveProperty('db');
      expect(response.body).toHaveProperty('redis');
    });
  });

  describe('Root', () => {
    it('should handle unknown routes', async () => {
      await request(
        app.getHttpServer() as unknown as Parameters<typeof request>[0],
      )
        .get('/api/unknown-route')
        .expect(404);
    });
  });
});
